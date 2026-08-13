# Khung XML cho test plan JMeter 5.6.3

Mọi đoạn dưới đây đã **sửa sẵn bốn lỗi** trong `references/jmeter-pitfalls.md`. Dùng nguyên, đừng viết lại từ đầu.

## Quy tắc cấu trúc bắt buộc

JMeter yêu cầu **mỗi phần tử phải có một `<hashTree>` đi liền ngay sau nó**. Sai quy tắc này thì JMeter âm thầm bỏ phần tử mà không báo lỗi.

```xml
<PhầnTử .../>
<hashTree/>              <!-- phần tử không có con -->

<PhầnTử .../>
<hashTree>               <!-- phần tử có con -->
  <PhầnTửCon .../>
  <hashTree/>
</hashTree>
```

## 1. Khung ngoài

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="{MSSV}_{Loại}_{YYYYMMDD} - {mô tả}" enabled="true">
      <stringProp name="TestPlan.comments">{ghi chú: luồng, mục tiêu, hồ sơ tải}</stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments">
          <!-- chèn biến ở đây, xem mục 2 -->
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <!-- config chung + thread group -->
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

## 2. Biến override được

Mọi tham số quan trọng phải dùng `${__P(tên,mặc_định)}` để override qua dòng lệnh.

```xml
<elementProp name="BASE_HOST" elementType="Argument">
  <stringProp name="Argument.name">BASE_HOST</stringProp>
  <stringProp name="Argument.value">${__P(host,localhost)}</stringProp>
  <stringProp name="Argument.metadata">=</stringProp>
</elementProp>
```

Bộ biến tối thiểu: `BASE_HOST`, `BASE_PORT`, `DATA_DIR`, cộng các biến tải riêng của từng kịch bản (`VUSERS`/`RAMPUP`/`DURATION` cho Load, `STEP_VUSERS`/`STEP_RAMPUP` cho Stress, `BASE_VUSERS`/`SPIKE_VUSERS` cho Spike).

Chạy: `jmeter -n -t plan.jmx -Jvusers=100 -Jduration=300 -l out.jtl`

## 3. Config chung

```xml
<ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
    <collectionProp name="Arguments.arguments"/>
  </elementProp>
  <stringProp name="HTTPSampler.domain">${BASE_HOST}</stringProp>
  <stringProp name="HTTPSampler.port">${BASE_PORT}</stringProp>
  <stringProp name="HTTPSampler.protocol">http</stringProp>
  <stringProp name="HTTPSampler.contentEncoding">UTF-8</stringProp>
  <stringProp name="HTTPSampler.connect_timeout">10000</stringProp>
  <stringProp name="HTTPSampler.response_timeout">30000</stringProp>
</ConfigTestElement>
<hashTree/>
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
  <collectionProp name="HeaderManager.headers">
    <elementProp name="" elementType="Header">
      <stringProp name="Header.name">Content-Type</stringProp>
      <stringProp name="Header.value">application/json</stringProp>
    </elementProp>
    <elementProp name="" elementType="Header">
      <stringProp name="Header.name">Accept</stringProp>
      <stringProp name="Header.value">application/json</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>
<hashTree/>
<CookieManager guiclass="CookiePanel" testclass="CookieManager" testname="HTTP Cookie Manager" enabled="true">
  <boolProp name="CookieManager.clearEachIteration">true</boolProp>
  <stringProp name="CookieManager.policy">standard</stringProp>
</CookieManager>
<hashTree/>
```

## 4. Thread group

```xml
<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="{tên mô tả}" enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
    <boolProp name="LoopController.continue_forever">false</boolProp>
    <intProp name="LoopController.loops">-1</intProp>
  </elementProp>
  <stringProp name="ThreadGroup.num_threads">${VUSERS}</stringProp>
  <stringProp name="ThreadGroup.ramp_time">${RAMPUP}</stringProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp>
  <stringProp name="ThreadGroup.duration">${DURATION}</stringProp>
  <stringProp name="ThreadGroup.delay">0</stringProp>
  <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
</ThreadGroup>
```

`loops=-1` + `scheduler=true` nghĩa là lặp đến hết `duration`. **Kết hợp này bắt buộc phải đi cùng `recycle=true` ở CSV** — xem lỗi 1.

Kịch bản nhiều giai đoạn: lặp lại khối trên với `delay` khác nhau, `duration` thu dần để cùng kết thúc.

## 5. CSV Data Set — cấu hình an toàn

```xml
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV - users.csv" enabled="true">
  <stringProp name="filename">${DATA_DIR}/users.csv</stringProp>
  <stringProp name="fileEncoding">UTF-8</stringProp>
  <stringProp name="variableNames">email,password</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp>
  <stringProp name="delimiter">,</stringProp>
  <boolProp name="quotedData">false</boolProp>
  <boolProp name="recycle">true</boolProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
</CSVDataSet>
<hashTree/>
```

⚠️ `recycle=true` + `stopThread=false` là **mặc định an toàn**. Chỉ đổi sang `recycle=false` khi đã tính tổng vòng lặp và CSV đủ dòng — xem lỗi 1.

## 6. Sampler — timer nằm TRONG hashTree

Đây là cách sửa lỗi 2. Timer phải nằm **bên trong** hashTree của sampler, không ngang hàng.

```xml
<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="01 POST /api/login [auth-heavy]" enabled="true">
  <boolProp name="HTTPSampler.postBodyRaw">true</boolProp>
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
    <collectionProp name="Arguments.arguments">
      <elementProp name="" elementType="HTTPArgument">
        <boolProp name="HTTPArgument.always_encode">false</boolProp>
        <stringProp name="Argument.value">{"email":"${email}","password":"${password}"}</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
  <stringProp name="HTTPSampler.path">/api/login</stringProp>
  <stringProp name="HTTPSampler.method">POST</stringProp>
  <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
  <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
</HTTPSamplerProxy>
<hashTree>
  <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Assert - HTTP 200" enabled="true">
    <collectionProp name="Asserion.test_strings">
      <stringProp name="49586">200</stringProp>
    </collectionProp>
    <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
    <boolProp name="Assertion.assume_success">false</boolProp>
    <intProp name="Assertion.test_type">8</intProp>
  </ResponseAssertion>
  <hashTree/>
  <JSONPathAssertion guiclass="JSONPathAssertionGui" testclass="JSONPathAssertion" testname="Assert - $.token khong rong" enabled="true">
    <stringProp name="JSON_PATH">$.token</stringProp>
    <stringProp name="EXPECTED_VALUE">^.+$</stringProp>
    <boolProp name="JSONVALIDATION">true</boolProp>
    <boolProp name="EXPECT_NULL">false</boolProp>
    <boolProp name="INVERT">false</boolProp>
    <boolProp name="ISREGEX">true</boolProp>
  </JSONPathAssertion>
  <hashTree/>
  <JSONPostProcessor guiclass="JSONPostProcessorGui" testclass="JSONPostProcessor" testname="Extract - authToken" enabled="true">
    <stringProp name="JSONPostProcessor.referenceNames">authToken</stringProp>
    <stringProp name="JSONPostProcessor.jsonPathExprs">$.token</stringProp>
    <stringProp name="JSONPostProcessor.match_numbers">1</stringProp>
    <stringProp name="JSONPostProcessor.defaultValues">TOKEN_NOT_FOUND</stringProp>
  </JSONPostProcessor>
  <hashTree/>
  <UniformRandomTimer guiclass="UniformRandomTimerGui" testclass="UniformRandomTimer" testname="Think time 1.5-2.5s" enabled="true">
    <stringProp name="ConstantTimer.delay">1500</stringProp>
    <stringProp name="RandomTimer.range">1000</stringProp>
  </UniformRandomTimer>
  <hashTree/>
</hashTree>
```

Think time thực tế = `delay` đến `delay + range` mili giây.

## 7. If Controller chặn bước sau khi đăng nhập hỏng

```xml
<IfController guiclass="IfControllerPanel" testclass="IfController" testname="IF - co token hop le" enabled="true">
  <stringProp name="IfController.condition">"${authToken}" != "TOKEN_NOT_FOUND"</stringProp>
  <boolProp name="IfController.evaluateAll">false</boolProp>
  <boolProp name="IfController.useExpression">false</boolProp>
</IfController>
<hashTree>
  <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="Header - Bearer token" enabled="true">
    <collectionProp name="HeaderManager.headers">
      <elementProp name="" elementType="Header">
        <stringProp name="Header.name">Authorization</stringProp>
        <stringProp name="Header.value">Bearer ${authToken}</stringProp>
      </elementProp>
    </collectionProp>
  </HeaderManager>
  <hashTree/>
  <!-- các sampler cần xác thực đặt ở đây -->
</hashTree>
```

Không có If Controller thì mỗi vòng lặp hỏng sinh thêm 4 request rác, làm tỉ lệ lỗi sai lệch.

## 8. Listener theo kịch bản

Ba kịch bản dùng **ba `guiclass` khác nhau**:

| Kịch bản | guiclass | testclass |
|---|---|---|
| Load | `SummaryReport` | `ResultCollector` |
| Stress | `StatVisualizer` | `ResultCollector` |
| Spike | `ViewResultsFullVisualizer` | `ResultCollector` |

```xml
<ResultCollector guiclass="{guiclass}" testclass="ResultCollector" testname="{tên}" enabled="true">
  <boolProp name="ResultCollector.error_logging">false</boolProp>
  <objProp>
    <name>saveConfig</name>
    <value class="SampleSaveConfiguration">
      <time>true</time><latency>true</latency><timestamp>true</timestamp>
      <success>true</success><label>true</label><code>true</code>
      <message>true</message><threadName>true</threadName><dataType>true</dataType>
      <encoding>false</encoding><assertions>true</assertions><subresults>true</subresults>
      <responseData>false</responseData><samplerData>false</samplerData><xml>false</xml>
      <fieldNames>true</fieldNames><responseHeaders>false</responseHeaders>
      <requestHeaders>false</requestHeaders><responseDataOnError>false</responseDataOnError>
      <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
      <assertionsResultsToSave>0</assertionsResultsToSave>
      <bytes>true</bytes><sentBytes>true</sentBytes><url>true</url>
      <threadCounts>true</threadCounts><idleTime>true</idleTime><connectTime>true</connectTime>
    </value>
  </objProp>
  <stringProp name="filename"></stringProp>
</ResultCollector>
<hashTree/>
```

Riêng Spike đặt `error_logging=true` và `responseDataOnError=true` — xem `scenario-profiles.md`.

`threadCounts=true` là bắt buộc: cột `allThreads` trong `.jtl` là cách duy nhất xác nhận số VU thật sự đạt được.
