---
title: 电路分析工具箱
date: 2026-06-04 22:20:00
---

<style>
:root {
  --tool-bg: rgba(255,255,255,0.92);
  --tool-border: #e0d4f0;
  --tool-accent: #7c3aed;
  --tool-accent2: #a78bfa;
  --tool-radius: 12px;
  --tool-shadow: 0 2px 12px rgba(0,0,0,0.08);
  --card-gap: 16px;
}
* { box-sizing: border-box; }

.circuit-toolbox {
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'Noto Serif SC', -apple-system, 'Microsoft YaHei', sans-serif;
}
.circuit-toolbox .tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--card-gap);
}
@media (max-width: 768px) {
  .circuit-toolbox .tool-grid { grid-template-columns: 1fr; }
}

.circuit-toolbox .tool-card {
  background: var(--tool-bg);
  border: 1px solid var(--tool-border);
  border-radius: var(--tool-radius);
  padding: 20px;
  box-shadow: var(--tool-shadow);
  backdrop-filter: blur(8px);
  transition: transform 0.2s;
}
.circuit-toolbox .tool-card:hover {
  transform: translateY(-2px);
}
.circuit-toolbox .tool-card h3 {
  margin: 0 0 6px 0;
  font-size: 16px;
  color: var(--tool-accent);
  display: flex;
  align-items: center;
  gap: 8px;
}
.circuit-toolbox .tool-card h3 small {
  font-size: 12px;
  font-weight: normal;
  color: #888;
}
.circuit-toolbox .tool-card .formula {
  font-size: 13px;
  color: #666;
  margin: 2px 0 12px 0;
  padding: 4px 8px;
  background: #f5f0ff;
  border-radius: 6px;
  display: inline-block;
}
.circuit-toolbox .input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.circuit-toolbox .input-row label {
  font-size: 13px;
  min-width: 50px;
  color: #333;
}
.circuit-toolbox .input-row input, 
.circuit-toolbox .input-row select {
  flex: 1;
  min-width: 60px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}
.circuit-toolbox .input-row input:focus,
.circuit-toolbox .input-row select:focus {
  border-color: var(--tool-accent);
  box-shadow: 0 0 0 2px rgba(124,58,237,0.15);
}
.circuit-toolbox .input-row input.result {
  background: #f0fdf4;
  border-color: #86efac;
  font-weight: bold;
}
.circuit-toolbox .input-row input.error {
  background: #fef2f2;
  border-color: #fca5a5;
}
.circuit-toolbox .calc-btn {
  background: var(--tool-accent);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}
.circuit-toolbox .calc-btn:hover {
  background: var(--tool-accent2);
}
.circuit-toolbox .calc-btn:active {
  transform: scale(0.97);
}
.circuit-toolbox .clear-btn {
  background: #f3f4f6;
  color: #555;
  border: 1px solid #ddd;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.circuit-toolbox .clear-btn:hover {
  background: #e5e7eb;
}
.circuit-toolbox .result-area {
  margin-top: 10px;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 3px solid var(--tool-accent);
  font-size: 14px;
  line-height: 1.8;
  display: none;
}
.circuit-toolbox .result-area.show {
  display: block;
}
.circuit-toolbox .result-area .highlight {
  color: var(--tool-accent);
  font-weight: bold;
}
.circuit-toolbox .knowledge-tag {
  display: inline-block;
  background: #ede9fe;
  color: #5b21b6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  margin: 2px;
}
.circuit-toolbox .unit {
  color: #888;
  font-size: 12px;
  margin-left: 2px;
}
.circuit-toolbox .diagram {
  text-align: center;
  margin: 8px 0;
  font-size: 20px;
  color: #999;
  letter-spacing: 2px;
}
</style>

<div class="circuit-toolbox">

<div style="text-align:center;margin-bottom:20px">
  <h2 style="color:#7c3aed">⚡ 电路分析工具箱</h2>
  <p style="color:#666;font-size:14px">输入已知参数，自动计算未知量，并列出所用知识点</p>
</div>

<div class="tool-grid">

<!-- 1. 欧姆定律 -->
<div class="tool-card">
  <h3>📐 欧姆定律 <small>Ohm's Law</small></h3>
  <div class="formula">V = I × R</div>
  <div class="diagram">—💡—</div>
  <div class="input-row">
    <label>电压 V</label>
    <input type="number" id="ohm-v" placeholder="V" step="any">
    <select id="ohm-v-unit"><option>V</option><option>mV</option><option>kV</option></select>
  </div>
  <div class="input-row">
    <label>电流 I</label>
    <input type="number" id="ohm-i" placeholder="A" step="any">
    <select id="ohm-i-unit"><option>A</option><option>mA</option><option>µA</option></select>
  </div>
  <div class="input-row">
    <label>电阻 R</label>
    <input type="number" id="ohm-r" placeholder="Ω" step="any">
    <select id="ohm-r-unit"><option>Ω</option><option>kΩ</option><option>MΩ</option></select>
  </div>
  <div style="display:flex;gap:8px">
    <button class="calc-btn" onclick="calcOhm()">计算</button>
    <button class="clear-btn" onclick="clearFields('ohm')">清空</button>
  </div>
  <div id="ohm-result" class="result-area"></div>
</div>

<!-- 2. 串联电路 -->
<div class="tool-card">
  <h3>🔗 串联电路 <small>Series Circuit</small></h3>
  <div class="formula">R总 = R₁ + R₂ + ... &nbsp; I = V / R总</div>
  <div class="diagram">—R₁—R₂—</div>
  <div class="input-row">
    <label>R₁</label>
    <input type="number" id="series-r1" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>R₂</label>
    <input type="number" id="series-r2" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>电源 V</label>
    <input type="number" id="series-v" placeholder="V" step="any">
  </div>
  <button class="calc-btn" onclick="calcSeries()">计算</button>
  <div id="series-result" class="result-area"></div>
</div>

<!-- 3. 并联电路 -->
<div class="tool-card">
  <h3>🔀 并联电路 <small>Parallel Circuit</small></h3>
  <div class="formula">1/R总 = 1/R₁ + 1/R₂ &nbsp; I分 = V / R分</div>
  <div class="diagram">—┬—R₁—┐<br> &nbsp; └—R₂—┘</div>
  <div class="input-row">
    <label>R₁</label>
    <input type="number" id="para-r1" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>R₂</label>
    <input type="number" id="para-r2" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>电源 V</label>
    <input type="number" id="para-v" placeholder="V" step="any">
  </div>
  <button class="calc-btn" onclick="calcParallel()">计算</button>
  <div id="para-result" class="result-area"></div>
</div>

<!-- 4. 分压电路 -->
<div class="tool-card">
  <h3>🔽 分压电路 <small>Voltage Divider</small></h3>
  <div class="formula">Vout = Vin × R₂ / (R₁ + R₂)</div>
  <div class="diagram">Vin —R₁—┬— Vout<br> &nbsp; &nbsp; &nbsp; &nbsp; R₂<br> &nbsp; &nbsp; &nbsp; &nbsp; GND</div>
  <div class="input-row">
    <label>Vin</label>
    <input type="number" id="div-vin" placeholder="V" step="any">
  </div>
  <div class="input-row">
    <label>R₁</label>
    <input type="number" id="div-r1" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>R₂</label>
    <input type="number" id="div-r2" placeholder="Ω" step="any">
  </div>
  <button class="calc-btn" onclick="calcDivider()">计算</button>
  <div id="div-result" class="result-area"></div>
</div>

<!-- 5. 功率计算 -->
<div class="tool-card">
  <h3>🔥 功率计算 <small>Power</small></h3>
  <div class="formula">P = V × I = I²R = V²/R</div>
  <div class="input-row">
    <label>电压 V</label>
    <input type="number" id="pow-v" placeholder="V" step="any">
  </div>
  <div class="input-row">
    <label>电流 I</label>
    <input type="number" id="pow-i" placeholder="A" step="any">
  </div>
  <div class="input-row">
    <label>电阻 R</label>
    <input type="number" id="pow-r" placeholder="Ω" step="any">
  </div>
  <button class="calc-btn" onclick="calcPower()">计算</button>
  <div id="pow-result" class="result-area"></div>
</div>

<!-- 6. 电阻色环解码 -->
<div class="tool-card">
  <h3>🎨 电阻色环解码 <small>Color Code</small></h3>
  <div class="formula">四环电阻：A B ×10^C ±D%</div>
  <div class="input-row">
    <label>环1</label>
    <select id="cc-1">
      <option value="0">黑 0</option><option value="1">棕 1</option>
      <option value="2">红 2</option><option value="3">橙 3</option>
      <option value="4">黄 4</option><option value="5">绿 5</option>
      <option value="6">蓝 6</option><option value="7">紫 7</option>
      <option value="8">灰 8</option><option value="9">白 9</option>
    </select>
  </div>
  <div class="input-row">
    <label>环2</label>
    <select id="cc-2">
      <option value="0">黑 0</option><option value="1">棕 1</option>
      <option value="2">红 2</option><option value="3">橙 3</option>
      <option value="4">黄 4</option><option value="5">绿 5</option>
      <option value="6">蓝 6</option><option value="7">紫 7</option>
      <option value="8">灰 8</option><option value="9">白 9</option>
    </select>
  </div>
  <div class="input-row">
    <label>倍率</label>
    <select id="cc-3">
      <option value="1">黑 ×1</option><option value="10">棕 ×10</option>
      <option value="100">红 ×100</option><option value="1000">橙 ×1k</option>
      <option value="10000">黄 ×10k</option><option value="100000">绿 ×100k</option>
      <option value="1000000">蓝 ×1M</option>
    </select>
  </div>
  <div class="input-row">
    <label>误差</label>
    <select id="cc-4">
      <option value="±1%">棕 ±1%</option><option value="±2%">红 ±2%</option>
      <option value="±0.5%">绿 ±0.5%</option><option value="±0.25%">蓝 ±0.25%</option>
      <option value="±5%">金 ±5%</option><option value="±10%">银 ±10%</option>
    </select>
  </div>
  <button class="calc-btn" onclick="calcColorCode()">解码</button>
  <div id="cc-result" class="result-area"></div>
</div>

<!-- 7. 基尔霍夫电流定律 KCL -->
<div class="tool-card">
  <h3>🌊 KCL 节点电流 <small>Kirchhoff's Current Law</small></h3>
  <div class="formula">ΣI入 = ΣI出</div>
  <div class="input-row">
    <label>I₁ 流入</label>
    <input type="number" id="kcl-i1" placeholder="A" step="any">
  </div>
  <div class="input-row">
    <label>I₂ 流入</label>
    <input type="number" id="kcl-i2" placeholder="A" step="any">
  </div>
  <div class="input-row">
    <label>I₃ 流出</label>
    <input type="number" id="kcl-i3" placeholder="A" step="any">
  </div>
  <button class="calc-btn" onclick="calcKCL()">计算未知电流</button>
  <div id="kcl-result" class="result-area"></div>
</div>

<!-- 8. RC 时间常数 -->
<div class="tool-card">
  <h3>⏱️ RC 时间常数 <small>Time Constant</small></h3>
  <div class="formula">τ = R × C</div>
  <div class="input-row">
    <label>电阻 R</label>
    <input type="number" id="rc-r" placeholder="Ω" step="any">
  </div>
  <div class="input-row">
    <label>电容 C</label>
    <input type="number" id="rc-c" placeholder="F" step="any">
  </div>
  <button class="calc-btn" onclick="calcRC()">计算</button>
  <div id="rc-result" class="result-area"></div>
</div>

</div><!-- /tool-grid -->

</div><!-- /circuit-toolbox -->

<script>
// ---- 单位转换辅助 ----
function getUnitValue(id) {
  var v = parseFloat(document.getElementById(id).value);
  if (isNaN(v)) return null;
  var unitMap = {
    'V': 1, 'mV': 0.001, 'kV': 1000,
    'A': 1, 'mA': 0.001, 'µA': 0.000001,
    'Ω': 1, 'kΩ': 1000, 'MΩ': 1000000
  };
  var unitSel = document.getElementById(id + '-unit');
  if (unitSel) {
    var unit = unitSel.value;
    v = v * (unitMap[unit] || 1);
  }
  return v;
}

function formatVal(v) {
  if (v === null || isNaN(v)) return '—';
  if (Math.abs(v) >= 1000000) return (v/1000000).toFixed(3) + ' M';
  if (Math.abs(v) >= 1000) return (v/1000).toFixed(3) + ' k';
  if (Math.abs(v) >= 1) return v.toFixed(3);
  if (Math.abs(v) >= 0.001) return (v*1000).toFixed(3) + ' m';
  if (Math.abs(v) >= 0.000001) return (v*1000000).toFixed(3) + ' µ';
  return v.toExponential(3);
}

function formatResistance(v) {
  if (v >= 1000000) return (v/1000000).toFixed(2) + ' MΩ';
  if (v >= 1000) return (v/1000).toFixed(2) + ' kΩ';
  return v.toFixed(2) + ' Ω';
}

function showResult(id, html, knowledge) {
  var el = document.getElementById(id);
  var kHtml = knowledge ? '<br>📖 <span style="font-size:12px;color:#888">涉及知识点：</span>' + 
    knowledge.map(function(k) { return '<span class="knowledge-tag">' + k + '</span>'; }).join('') : '';
  el.innerHTML = html + kHtml;
  el.classList.add('show');
}

function clearFields(prefix) {
  document.querySelectorAll('[id^="' + prefix + '-"]').forEach(function(el) {
    if (el.tagName === 'INPUT') el.value = '';
  });
  var resultEl = document.getElementById(prefix + '-result');
  if (resultEl) resultEl.classList.remove('show');
}

// ---- 1. 欧姆定律 ----
function calcOhm() {
  var v = getUnitValue('ohm-v');
  var i = getUnitValue('ohm-i');
  var r = getUnitValue('ohm-r');
  var known = [v !== null, i !== null, r !== null].filter(Boolean).length;
  if (known < 2) { showResult('ohm-result', '⚠️ 至少输入两个已知量'); return; }
  
  var html = '';
  var knowledge = ['欧姆定律 V = IR'];
  if (v === null) { v = i * r; html += 'V = ' + formatVal(i) + ' × ' + formatVal(r) + ' = <span class="highlight">' + formatVal(v) + ' V</span><br>'; }
  if (i === null) { i = v / r; html += 'I = ' + formatVal(v) + ' / ' + formatVal(r) + ' = <span class="highlight">' + formatVal(i) + ' A</span><br>'; }
  if (r === null) { r = v / i; html += 'R = ' + formatVal(v) + ' / ' + formatVal(i) + ' = <span class="highlight">' + formatResistance(r) + '</span><br>'; }
  showResult('ohm-result', html, knowledge);
}

// ---- 2. 串联 ----
function calcSeries() {
  var r1 = parseFloat(document.getElementById('series-r1').value);
  var r2 = parseFloat(document.getElementById('series-r2').value);
  var v = parseFloat(document.getElementById('series-v').value);
  if (isNaN(r1) || isNaN(r2) || isNaN(v)) { showResult('series-result', '⚠️ 请填写所有参数'); return; }
  
  var rt = r1 + r2;
  var i = v / rt;
  var v1 = i * r1, v2 = i * r2;
  var p = v * i;
  
  var html = 'R总 = ' + formatResistance(rt) + '<br>' +
    'I = ' + formatVal(i) + ' A<br>' +
    'V₁ = ' + formatVal(v1) + ' V（R₁两端）<br>' +
    'V₂ = ' + formatVal(v2) + ' V（R₂两端）<br>' +
    'P总 = ' + formatVal(p) + ' W';
  
  showResult('series-result', html, ['串联电路 R总 = R₁ + R₂', '欧姆定律 V = IR', '分压原理']);
}

// ---- 3. 并联 ----
function calcParallel() {
  var r1 = parseFloat(document.getElementById('para-r1').value);
  var r2 = parseFloat(document.getElementById('para-r2').value);
  var v = parseFloat(document.getElementById('para-v').value);
  if (isNaN(r1) || isNaN(r2) || isNaN(v)) { showResult('para-result', '⚠️ 请填写所有参数'); return; }
  
  var rt = 1 / (1/r1 + 1/r2);
  var i1 = v / r1, i2 = v / r2, it = i1 + i2;
  var p = v * it;
  
  var html = 'R总 = ' + formatResistance(rt) + '<br>' +
    'I₁ = ' + formatVal(i1) + ' A（R₁支路）<br>' +
    'I₂ = ' + formatVal(i2) + ' A（R₂支路）<br>' +
    'I总 = ' + formatVal(it) + ' A<br>' +
    'P总 = ' + formatVal(p) + ' W';
  
  showResult('para-result', html, ['并联电路 1/R总 = 1/R₁ + 1/R₂', 'KCL 节点电流', '各支路电压相等']);
}

// ---- 4. 分压 ----
function calcDivider() {
  var vin = parseFloat(document.getElementById('div-vin').value);
  var r1 = parseFloat(document.getElementById('div-r1').value);
  var r2 = parseFloat(document.getElementById('div-r2').value);
  if (isNaN(vin) || isNaN(r1) || isNaN(r2)) { showResult('div-result', '⚠️ 请填写所有参数'); return; }
  
  var vout = vin * r2 / (r1 + r2);
  var i = vin / (r1 + r2);
  
  var html = 'Vout = ' + formatVal(vin) + ' × ' + formatResistance(r2) + ' / ' + formatResistance(r1 + r2) + '<br>' +
    '= <span class="highlight">' + formatVal(vout) + ' V</span><br>' +
    '分压比 = ' + (r2/(r1+r2)*100).toFixed(1) + '%<br>' +
    '回路电流 I = ' + formatVal(i) + ' A';
  
  showResult('div-result', html, ['分压公式 Vout = Vin × R₂/(R₁+R₂)', '串联电路特性']);
}

// ---- 5. 功率 ----
function calcPower() {
  var v = parseFloat(document.getElementById('pow-v').value);
  var i = parseFloat(document.getElementById('pow-i').value);
  var r = parseFloat(document.getElementById('pow-r').value);
  
  var known = [!isNaN(v), !isNaN(i), !isNaN(r)].filter(Boolean).length;
  if (known < 2) { showResult('pow-result', '⚠️ 至少输入两个已知量'); return; }
  
  var html = '';
  var knowledge = ['功率公式 P = VI = I²R = V²/R'];
  
  if (!isNaN(v) && !isNaN(i)) {
    var p = v * i;
    html = 'P = ' + formatVal(v) + ' × ' + formatVal(i) + ' = <span class="highlight">' + formatVal(p) + ' W</span><br>' + html;
    if (isNaN(r)) { r = v / i; html += 'R = ' + formatResistance(v/i) + '（由 V/I 计算）<br>'; knowledge.push('欧姆定律'); }
  }
  if (!isNaN(i) && !isNaN(r) && isNaN(v)) {
    v = i * r;
    html += 'V = ' + formatVal(i) + ' × ' + formatVal(r) + ' = <span class="highlight">' + formatVal(v) + ' V</span><br>';
    html += 'P = I²R = ' + formatVal(i*i*r) + ' W<br>';
    knowledge.push('欧姆定律');
  }
  if (!isNaN(v) && !isNaN(r) && isNaN(i)) {
    i = v / r;
    html += 'I = ' + formatVal(v) + ' / ' + formatVal(r) + ' = <span class="highlight">' + formatVal(i) + ' A</span><br>';
    html += 'P = V²/R = ' + formatVal(v*v/r) + ' W<br>';
    knowledge.push('欧姆定律');
  }
  
  showResult('pow-result', html, knowledge);
}

// ---- 6. 色环 ----
function calcColorCode() {
  var d1 = parseInt(document.getElementById('cc-1').value);
  var d2 = parseInt(document.getElementById('cc-2').value);
  var mul = parseFloat(document.getElementById('cc-3').value);
  var err = document.getElementById('cc-4').value;
  
  var val = (d1 * 10 + d2) * mul;
  
  var html = '阻值 = <span class="highlight">' + formatResistance(val) + '</span><br>' +
    '误差 = ' + err;
  
  var knowledge = ['色环电阻读数法'];
  if (val >= 1000 && val < 1000000) knowledge.push('kΩ = ×10³');
  if (val >= 1000000) knowledge.push('MΩ = ×10⁶');
  
  showResult('cc-result', html, knowledge);
}

// ---- 7. KCL ----
function calcKCL() {
  var i1 = parseFloat(document.getElementById('kcl-i1').value);
  var i2 = parseFloat(document.getElementById('kcl-i2').value);
  var i3 = parseFloat(document.getElementById('kcl-i3').value);
  
  var known = [!isNaN(i1), !isNaN(i2), !isNaN(i3)].filter(Boolean).length;
  if (known < 2) { showResult('kcl-result', '⚠️ 至少输入两个已知电流'); return; }
  
  var html = '';
  var knowledge = ['基尔霍夫电流定律 KCL: ΣI入 = ΣI出'];
  
  if (!isNaN(i1) && !isNaN(i2) && isNaN(i3)) {
    i3 = i1 + i2;
    html = 'I₃ = I₁ + I₂ = ' + formatVal(i1) + ' + ' + formatVal(i2) + ' = <span class="highlight">' + formatVal(i3) + ' A</span>';
  } else if (!isNaN(i1) && !isNaN(i3) && isNaN(i2)) {
    i2 = i3 - i1;
    html = 'I₂ = I₃ - I₁ = ' + formatVal(i3) + ' - ' + formatVal(i1) + ' = <span class="highlight">' + formatVal(i2) + ' A</span>';
  } else if (!isNaN(i2) && !isNaN(i3) && isNaN(i1)) {
    i1 = i3 - i2;
    html = 'I₁ = I₃ - I₂ = ' + formatVal(i3) + ' - ' + formatVal(i2) + ' = <span class="highlight">' + formatVal(i1) + ' A</span>';
  } else {
    html = 'I入 = ' + formatVal(i1) + ' + ' + formatVal(i2) + ' = ' + formatVal(i1+i2) + ' A<br>' +
           'I出 = ' + formatVal(i3) + ' A<br>' +
           'ΣI入 = ΣI出 ✅ ' + (Math.abs(i1+i2 - i3) < 0.001 ? '成立' : '不成立，差 ' + formatVal(Math.abs(i1+i2-i3)) + ' A');
  }
  
  showResult('kcl-result', html, knowledge);
}

// ---- 8. RC ----
function calcRC() {
  var r = parseFloat(document.getElementById('rc-r').value);
  var c = parseFloat(document.getElementById('rc-c').value);
  if (isNaN(r) || isNaN(c)) { showResult('rc-result', '⚠️ 请填写所有参数'); return; }
  
  var tau = r * c;
  var tCharge = tau * 5; // 5τ 充满
  
  var html = 'τ = R × C = ' + formatResistance(r) + ' × ' + formatVal(c) + ' F<br>' +
    '= <span class="highlight">' + formatVal(tau) + ' 秒</span><br>' +
    '充电至 63.2% 所需时间 = 1τ = ' + formatVal(tau) + ' s<br>' +
    '近似充满时间 = 5τ = ' + formatVal(tCharge) + ' s';
  
  showResult('rc-result', html, ['RC 时间常数 τ = RC', '一阶电路响应：充电 v(t) = V(1-e⁻ᵗ/ʳ)']);
}
</script>
