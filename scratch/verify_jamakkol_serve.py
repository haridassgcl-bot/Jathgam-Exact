import urllib.request

res = urllib.request.urlopen('http://localhost:8080/')
html = res.read().decode('utf-8')
print('jamakkol toggle in HTML:', 'data-style="jamakkol"' in html)

res_cr = urllib.request.urlopen('http://localhost:8080/js/charts-renderer.js')
cr_js = res_cr.read().decode('utf-8')
print('renderJamakkolAaroodamChart in charts-renderer:', 'renderJamakkolAaroodamChart' in cr_js)

res_app = urllib.request.urlopen('http://localhost:8080/js/app.js')
app_js = res_app.read().decode('utf-8')
print('renderJamakkolAaroodamChart called in app.js:', 'ChartsRenderer.renderJamakkolAaroodamChart' in app_js)
