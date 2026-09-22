"""Offline DOM integration checks. No navigation policy changes or external network.
Requires Python playwright + a Chromium executable (CHROMIUM_PATH may override).
Assets are supplied in memory because the authoring environment blocks URL navigation.
This is NOT a Next.js build or a deployed-site browser test.
"""
from pathlib import Path
import json, os, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public/labs/agreement'
OUT=ROOT/'test-results'
OUT.mkdir(exist_ok=True)
html=(ASSETS/'index.html').read_text().replace('<link rel="stylesheet" href="./lab.css">','<style>'+(ASSETS/'lab.css').read_text()+'</style>').replace('<script type="module" src="./app.mjs"></script>','')
core=re.sub(r'\bexport\s+', '',(ASSETS/'core.mjs').read_text())
app=re.sub(r'^import .*?;\n','',(ASSETS/'app.mjs').read_text(),count=1)
fixture=json.loads((ASSETS/'fixtures.json').read_text())
prompt=(ASSETS/'prompt.txt').read_text()
checks=[]
def check(name,condition):
    assert condition,name
    checks.append(name)
def load(page):
    page.set_content(html)
    page.evaluate('''async ({code,fixture,prompt}) => {
      window.fetch=async url=> {
        if(url==='./fixtures.json')return {ok:true,json:async()=>fixture};
        if(url==='./prompt.txt')return {ok:true,text:async()=>prompt};
        throw new Error('Unexpected asset request: '+url);
      };
      await eval(code);
    }''',dict(code=core+'\n'+app,fixture=fixture,prompt=prompt))
    page.wait_for_selector('[data-task="demo-creative"]')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=b.new_page(viewport={'width':1600,'height':1150})
    page.set_default_timeout(5000)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    load(page)
    check('six task selectors',page.locator('[data-task]').count()==6)
    page.click('#preview-open')
    check('empty on untouched chat',page.locator('.preview-empty').is_visible())
    check('empty window creates no artifact',page.locator('#preview-pin').is_disabled())
    page.keyboard.press('Escape')
    check('Escape closes dialog',not page.locator('#preview-dialog').is_visible())
    check('focus returns to preview launcher',page.evaluate('document.activeElement.id')=='preview-open')
    page.click('#advance'); page.click('#advance')
    check('scoped correction appears',page.locator('.change-card').count()==1)
    original=page.locator('.message.assistant pre').last.text_content()
    page.click('[data-undo]')
    check('undo retains artifact output',page.locator('.message.assistant pre').last.text_content()==original)
    check('undo marked reverted',page.locator('.change-card').get_attribute('data-status')=='reverted')
    page.click('[data-panel="checks"]')
    check('check initially not run','NOT CHECKED' in page.locator('#inspector-body').inner_text())
    page.click('[data-check="latest"]')
    check('narrow check actually updates status','PASS' in page.locator('#inspector-body').inner_text())
    page.click('#preview-open')
    page.select_option('#preview-revision','1');page.click('#preview-pin')
    page.click('#failure-toggle')
    check('interrupted update clearly simulated','SIMULATED FAILURE' in page.locator('#preview-badge').inner_text())
    check('last complete version preserved',page.locator('#preview-revision').input_value()=='1')
    frame=page.locator('#preview-content iframe')
    check('artifact iframe has empty sandbox',frame.get_attribute('sandbox')=='')
    page.click('[data-preview="changes"]')
    check('revision comparison has before and after',page.locator('.diff-grid>div').count()==2)
    page.click('#preview-layout')
    check('dock layout changes without artifact change','docked' in page.locator('#preview-dialog').get_attribute('class') and page.locator('#preview-revision').input_value()=='1')
    page.keyboard.press('Escape')
    page.click('[data-task="demo-casual"]')
    for _ in range(3):page.click('#advance')
    check('casual chat omits optimization footer',page.locator('.optimization').count()==0)
    page.click('#preview-open')
    check('casual chat preview stays empty',page.locator('.preview-empty').is_visible())
    page.keyboard.press('Escape')
    page.click('[data-task="demo-format"]')
    for _ in range(3):page.click('#advance')
    check('exact-format transcript has only JSON',page.locator('.message.assistant pre').last.text_content()=='{"status":"ready","count":4}')
    check('exact-format footer omitted',page.locator('.optimization').count()==0)
    page.click('[data-view="pilot"]')
    check('ledger begins with no measurements',page.locator('#run-total').inner_text()=='0 observed runs')
    check('unknown metrics displayed as missing',page.locator('#metrics').inner_text().count('—')==18)
    page.click('#run-open')
    for name,value in dict(model='TEST ONLY',baselineSnapshot='Test baseline',settings='Offline DOM test; no model call',transcript='<script>window.injected=true</script> is inert text',evidence='Synthetic harness record; must not be published as a real result').items():
        page.fill(f'[name="{name}"]',value)
    page.click('#run-form button[type="submit"]')
    check('form adds only explicit record',page.locator('#run-total').inner_text()=='1 observed runs')
    check('imported transcript not executed',page.evaluate('typeof window.injected')=='undefined')
    check('unknown counts stay unknown after entry','0 known / 1 runs' in page.locator('#metrics').inner_text())
    page.locator('.run-record summary').click()
    page.click('[data-remove-run="0"]')
    check('local record can be removed',page.locator('#run-total').inner_text()=='0 observed runs')
    page.locator('summary',has_text='Label-blinded pairwise review').click()
    page.fill('#pair-a','Interaction A');page.fill('#pair-b','Interaction B');page.click('#pair-start')
    check('pairwise sides include both transcripts',{page.locator('#pair-left').inner_text(),page.locator('#pair-right').inner_text()}=={'Interaction A','Interaction B'})
    page.fill('#pair-reason','No differentiating evidence in this harness.');page.click('[data-vote="insufficient"]')
    check('pairwise insufficient option records and closes',not page.locator('#pair-dialog').is_visible())
    page.click('[data-view="concept"]')
    check('design notes reachable',page.locator('#concept').is_visible())
    # Each width tests all three views; table/task-strip internal scrolling is intentional.
    for width in [1600,1440,1180,768,390,320]:
        page.set_viewport_size({'width':width,'height':1000})
        for v in ['playground','pilot','concept']:
            page.click(f'[data-view="{v}"]')
            check(f'no document overflow: {width}px / {v}',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
    check('no uncaught browser exceptions',not errors)
    # Screenshots from the actual DOM, but with file-transport mocked as documented.
    page=b.new_page(viewport={'width':1600,'height':1150});load(page)
    page.click('#advance');page.click('#advance')
    page.screenshot(path=str(OUT/'studio-desktop.png'),full_page=True)
    page.click('#preview-open');page.screenshot(path=str(OUT/'build-preview.png'))
    page.keyboard.press('Escape');page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(OUT/'studio-mobile.png'),full_page=True)
    b.close()
(OUT/'browser-receipt.json').write_text(json.dumps({'harness':'offline DOM; mocked source-file transport; no deployed URL tested','checksPassed':len(checks),'checks':checks,'uncaughtErrors':errors},indent=2)+'\n')
print(f'{len(checks)} offline browser checks passed. No deployed site or model outcomes tested.')
