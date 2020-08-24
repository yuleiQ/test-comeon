console.log('webpack');
import pic  from './images/dingkun.gif';

import './css/index.css'
import './css/index.less'

var img = new Image()
img.src = pic;
img.classList.add('logo')
var root = document.getElementById('root')
root.append(img)