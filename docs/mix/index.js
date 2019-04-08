$(function () {
    var mixStreamId = 'mixwebrtc-'+new Date().getTime();

        $('#mixStream').click(function () {
        var streamList = [{
            streamId: _config.idName,
            top: 0,
            left: 0,
            bottom: 320,
            right: 240,
        }];
        useLocalStreamList.forEach(function (stream) {
            streamList.push({
                streamId: stream.stream_id,
                top: 0,
                left: 0,
                bottom: 320,
                right: 240,
            })
        })

        console.log('mixStreamList:' + streamList)
        

        zg.updateMixStream({
            outputStreamId: mixStreamId,
            outputUrl: 'rtmp://test.aliyun.zego.im/zegodemo',
            outputBitrate: 300*1000,
            outputFps: 15,
            outputWidth: 240,
            outputHeight: 320,
            streamList: streamList
        }, function (mixStreamId, mixStreamInfo) {
            if (navigator.userAgent.indexOf('iPhone') !== -1 && getBrowser() == 'Safari') {
              hlsUrl = mixStreamInfo[0]['hlsUrls'][0].replace('http', 'https')
              $('#mixVideo')[0].src = hlsUrl
            } else {
              var flvUrl = mixStreamInfo[0]['flvUrls'][0].replace('http', 'https')
                console.log('mixStreamId: ' + mixStreamId);
                console.log('mixStreamUrl:' + flvUrl);
                alert('混流开始。。。')
                if (flvjs.isSupported()) {
                  var flvPlayer = flvjs.createPlayer({
                      type: 'flv',
                      url: flvUrl
                  });
                  flvPlayer.attachMediaElement($('#mixVideo')[0]);
                  flvPlayer.load(); 
                }
            }
            $('#mixVideo')[0].muted = false;
            $('#mixVideo').css('display', '')
        }, function (err, errorInfo) {
            alert('混流失败。。。')
            console.log('err: ' + JSON.stringify(err));
            console.log('errorInfo: ' + JSON.stringify(errorInfo));
        },);
    });

    $('#stopMixStream').click(function () {
        zg.stopMixStream({
            outputStreamId: mixStreamId
        }, function () {
            alert('停止混流成功。。。')
            console.log('stopMixStream success: ');
            $('#mixVideo')[0].src = ''
            $('#mixVideo').css('display', 'none')
        }, function (err) {
            alert('停止混流失败。。。')
            console.log('stopMixStream err: ');
            console.log(err);
        })
    });

});

