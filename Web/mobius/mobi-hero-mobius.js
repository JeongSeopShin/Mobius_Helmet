const path = 'http://192.168.56.1:7579/Mobius'

// ngrok을 이용하여 외부에서 예림 모비우스 서버 접속
// ngrok 실행할 때마다 uri가 바뀌기 때문에 예림 모비우스 사용하려면 열어달라고 말해야 함
//const path = 'http://b5bc-180-65-158-66.ngrok.io/Mobius'


// ### <ae> ###

function selectAe(ae_resource){

    console.log("<ae> 조회 : " + ae_resource);

    let uri = path + '/' + ae_resource;

    fetch(uri, {
    method: 'GET',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':'admin',
        'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}


function createAe(ae_resource, ae_api){

    console.log("<ae> 생성 : " + ae_resource);

    let uri = path;

    let item = {
        "m2m:ae" : {
              "rn": ae_resource,
              "api": ae_api,
              "rr": true
          }
      }

    fetch(uri, {
    method: 'POST',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':ae_resource,
        'Content-Type': 'application/json;ty=2',
        'Content-Length':'<calculated when request is sent>'
    },
    body: JSON.stringify(item)
})
    .then((res) => {
        if (res.statusText == 'OK' || res.statusText == 'Created') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

function deleteAe(ae_resource){

    console.log("<ae> 삭제 : " + ae_resource);

    let uri = path + '/' + ae_resource;

    fetch(uri, {
    method: 'DELETE',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':ae_resource,
        'Content-Type': 'application/json;ty=2',
        'Content-Length':'<calculated when request is sent>'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => {
                console.log(data);
                location.reload();
            });
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

// ### <cnt> ###

function selectCnt(ae_resource, cnt_resource){

    console.log("<cnt> 조회 : " + ae_resource + '/' + cnt_resource);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    fetch(uri, {
    method: 'GET',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':'admin',
        'Content-Type': 'application/json'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

function createCnt(ae_resource, cnt_resource, mni, con='no_cin'){      // <cnt> 생성 시, con값도 함께 들어오면 <cin> 생성해줌

    console.log("<cnt> 생성 : " + ae_resource + '/' + cnt_resource);

    let uri = path + '/' + ae_resource;

    let item = {
        "m2m:cnt" : {
          "rn": cnt_resource,
          "mni": mni
          }
      };

    fetch(uri, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; ty=3',
        'Content-Length':'<calculated when request is sent>',
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin': cnt_resource

    },
    body: JSON.stringify(item)
})
    .then((res) => {
        if (res.statusText == 'OK' || res.statusText == 'Created') {
            res.json().then(data => console.log(data));

            if(con != 'no_cin'){
                createCin(ae_resource, cnt_resource, con);
            }
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

function deleteCnt(ae_resource, cnt_resource){

    console.log("<cnt> 삭제 : " + ae_resource + '/' + cnt_resource);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    fetch(uri, {
    method: 'DELETE',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':cnt_resource,
        'Content-Type': 'application/json;ty=3',
        'Content-Length':'<calculated when request is sent>'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}



// ### <grp> ###

async function selectGrpAsync(ae_resource, grp_resource) {

    console.log('selectGrpAsync() 호출');

    let uri = path + '/'+ae_resource+'/'+grp_resource+'/fopt';
    if(ae_resource == 'Zone'){
        uri = path + '/' + grp_resource + '/fopt';
    }
    let response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Host':'<calculated when request is sent>',
            'User-Agent':'PostmanRuntime/7.28.4',
            'Accept': 'application/json',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'X-M2M-RI':'12345',
            'X-M2M-Origin':'admin',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response;
  }

function selectGrp(ae_resource, grp_resource, mode = 0){       // mode=0 : 기본조회, mode='fopt' : fopt조회(내부 정보까지)

    console.log("<grp> 조회 : " + ae_resource + '/' + grp_resource + ' mode:' + mode);

    let uri = path + '/' + ae_resource + '/' + grp_resource;

    if(mode == 'fopt'){
        uri += '/fopt'
    }

    fetch(uri, {
    method: 'GET',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':'admin',
        'Content-Type': 'application/json'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

function createGrp(ae_resource, mode = 'biogrp'){     // mode='biogrp' : 생체데이터그룹 생성, mode='entgrp' : 환경데이터그룹 생성

    console.log("<grp> 생성 : " + ae_resource + '/' + mode);

    let item = {};

    if (mode == 'biogrp'){
        item = {
            "m2m:grp" : {
                "rn": 'biogrp',
                "mid": [
                        "Mobius/"+ae_resource+"/location/la",
                        "Mobius/"+ae_resource+"/heartrate/la",
                        "Mobius/"+ae_resource+"/danger/la"
                ],
                "mnm":10
            }
        };
    }
    else if(mode == 'entgrp'){
        item = {
            "m2m:grp" : {
                "rn": 'entgrp',
                "mid": [
                        "Mobius/"+ae_resource+"/temperature/la",
                        "Mobius/"+ae_resource+"/humidity/la",
                        "Mobius/"+ae_resource+"/methane/la",
                        "Mobius/"+ae_resource+"/cmonoxide/la"
                ],
                "mnm":10
            }
        };
    }
    else if(mode == 'notegrp'){
        item = {
            "m2m:grp" : {
                "rn": 'notegrp',
                "mid": [
                        "Mobius/"+ae_resource+"/name/la",
                        "Mobius/"+ae_resource+"/hp/la",
                        "Mobius/"+ae_resource+"/location/la"
                ],
                "mnm":10
            }
        };
    }
    else{
        alert("입력값을 확인하세요.");
        return;
    }

    let uri = path + '/' + ae_resource;

    fetch(uri, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;ty=9',
        'Content-Length':'<calculated when request is sent>',
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin': mode

    },
    body: JSON.stringify(item)
})
    .then((res) => {
        if (res.statusText == 'OK' || res.statusText == 'Created') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

function deleteGrp(ae_resource, grp_resource){

    console.log("<grp> 삭제 : " + ae_resource + '/' + grp_resource);

    let uri = path + '/' + ae_resource + '/' + grp_resource;

    fetch(uri, {
    method: 'DELETE',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':grp_resource,
        'Content-Type': 'application/json;ty=9',
        'Content-Length':'<calculated when request is sent>'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}


// ### <cin> ###

function selectCin(ae_resource, cnt_resource, mode=0){       // mode=0: 전체 조회, mode='la':마지막con조회

    console.log("<cin> 조회 : " + ae_resource + '/' + cnt_resource);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    if(mode == 'la'){
        uri += '/la'
    }
    else{
        uri += '?rcn=4&ty=4'
    }

    fetch(uri, {
    method: 'GET',
    headers: {
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin':'admin',
        'Content-Type': 'application/json;ty=4',
        'Content-Length':'<calculated when request is sent>'
    }
})
    .then((res) => {
        if (res.statusText == 'OK') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

async function selectCinAsync(ae_resource, cnt_resource, mode=0) {

    console.log("<cin> 조회 : " + ae_resource + '/' + cnt_resource);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    if(mode == 'la'){
        uri += '/la'
    }
    else{
        //uri += '?rcn=4&ty=4&lim=15'           // lim=15로 하면 최신부터가 아니라 이전것부터 15로 자르는데 역순으로 자르는 방법 없나..
        uri += '?rcn=4&ty=4'
    }
    let response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Host':'<calculated when request is sent>',
            'User-Agent':'PostmanRuntime/7.28.4',
            'Accept': 'application/json',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'X-M2M-RI':'12345',
            'X-M2M-Origin':'admin',
            'Content-Type': 'application/json;ty=4',
            'Content-Length':'<calculated when request is sent>'
        }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response;
  }

function createCin(ae_resource, cnt_resource, con){

    console.log("<cin> 생성 : " + ae_resource + '/' + cnt_resource + '/' + con);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    let item = {
        "m2m:cin": {
            "con": con
        }
    };

    fetch(uri, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json;ty=4',
        'Content-Length':'<calculated when request is sent>',
        'Host':'<calculated when request is sent>',
        'User-Agent':'PostmanRuntime/7.28.4',
        'Accept': 'application/json',
        'Accept-Encoding':'gzip, deflate, br',
        'Connection':'keep-alive',
        'X-M2M-RI':'12345',
        'X-M2M-Origin': cnt_resource

    },
    body: JSON.stringify(item)
})
    .then((res) => {
        if (res.statusText == 'OK' || res.statusText == 'Created') {
            res.json().then(data => console.log(data));
        }
        else {
            alert('오류가 발생했습니다.');
            console.error(res);
        }
    }).catch(err => console.error(err));
}

async function createCinAsync(ae_resource, cnt_resource, con) {

    console.log("<cin> 생성 : " + ae_resource + '/' + cnt_resource + '/' + con);

    let uri = path + '/' + ae_resource + '/' + cnt_resource;

    let item = {
        "m2m:cin": {
            "con": con
        }
    };

    let response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;ty=4',
            'Content-Length':'<calculated when request is sent>',
            'Host':'<calculated when request is sent>',
            'User-Agent':'PostmanRuntime/7.28.4',
            'Accept': 'application/json',
            'Accept-Encoding':'gzip, deflate, br',
            'Connection':'keep-alive',
            'X-M2M-RI':'12345',
            'X-M2M-Origin': cnt_resource

        },
        body: JSON.stringify(item)
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response;
  }
