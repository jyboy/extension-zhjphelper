var reservationDate, firstCoach, secondCoach, firstTime, secondTime, canTwoTime;
var leftArray = [];
var timeShortArray = ["06:00", "07:00", "09:00", "12:00", "14:00", "16:00"];
var timeArray = ["", "07:00 ~ 09:00", "09:00 ~ 11:00", "12:00 ~ 14:00", "14:00 ~ 16:00", "16:00 ~ 18:00"];

if ($("iframe[name='培训预约']").length) {
    var $body = $("iframe[name='培训预约']").contents().find("body");
    if ($body.attr("onload")) {
        var count = 0;
        chrome.storage.local.get('reservationDate', function (result) {
            reservationDate = result.reservationDate;
            count++;
            if (count == 6) reserveCoach();
        });
        chrome.storage.local.get('firstCoach', function (result) {
            firstCoach = result.firstCoach;
            count++;
            if (count == 6) reserveCoach();
        });
        chrome.storage.local.get('secondCoach', function (result) {
            secondCoach = result.secondCoach;
            count++;
            if (count == 6) reserveCoach();
        });
        chrome.storage.local.get('firstTime', function (result) {
            firstTime = result.firstTime;
            count++;
            if (count == 6) reserveCoach();
        });
        chrome.storage.local.get('secondTime', function (result) {
            secondTime = result.secondTime;
            count++;
            if (count == 6) reserveCoach();
        });
        chrome.storage.local.get('canTwoTime', function (result) {
            canTwoTime = result.canTwoTime;
            count++;
            if (count == 6) reserveCoach();
        });
        sendMessageRequest("-1", $("#userName").text().split(" - ")[0]);
    } else {
        sendMessageRequest("1", "");
    }
} else {
    sendMessageRequest("0", "");
}

function sendMessageRequest(type, message) {
    var isRunning = false;
    if (type == "-1") {
        isRunning = true;
    }
    chrome.storage.local.set({'isRunning': isRunning}, function() {
        chrome.extension.sendRequest({
            type: type,
            message: message
        }, function(response) {

        });
    });
}

function reserveCoach() {
    var hasReserved = false;
    var $body = $("iframe[name='培训预约']").contents().find("body");
    var count = 0;
    $body.find(".dhx_cal_today_button").click();
    $body.find("#CoachScheduler").children(".dhx_cal_header").children("div").children(".dhx_scale_bar").each(function() {
        if (timeShortArray.indexOf($(this).text()) != -1) {
            leftArray.push($(this).css("left"));
            count++;
            if (count == 6) return false;
        }
    });
    var int = setInterval(function() {
        $body = $("iframe[name='培训预约']").contents().find("body");
        $body.find(".dhx_cal_today_button").click();
        for (var d = 0; d < reservationDate; d++) { // dev
            $body.find(".dhx_cal_next_button").click();
        }
        var $tr = $body.find("#CoachScheduler").children(".dhx_cal_data").children("table").children("tbody").children("tr");
        if ($tr.first().children("td").first().text() != "无" && !hasReserved) {
            var hasFirstCoachReserved = false;
            var hasSecondCoachReserved = false;
            $tr.each(function() {
                if($(this).children("td").first().text() == firstCoach) {
                    var $eventLine = $(this).children("td").last().children(".dhx_matrix_line").children(".dhx_cal_event_line");
                    if ($eventLine.length) {
                        var hasFirstLeftReserved = false;
                        $eventLine.each(function() {
                            if (str2num($(this).css("left")) + str2num(leftArray[0]) - str2num(leftArray[timeArray.indexOf(firstTime)]) == 1) {
                                $(this).click();
                                afterTimeClick();
                                hasFirstLeftReserved = true;
                                hasFirstCoachReserved = true;
                                // console.log(firstCoach + "  " + firstTime);
                                return false;
                            }
                        });
                        if (!hasFirstLeftReserved && secondTime || canTwoTime) {
                            $eventLine.each(function() {
                                if (str2num($(this).css("left")) + str2num(leftArray[0]) - str2num(leftArray[timeArray.indexOf(secondTime)]) == 1) {
                                    $(this).click();
                                    afterTimeClick();
                                    hasFirstCoachReserved = true;
                                    // console.log(firstCoach + "  " + secondTime);
                                    return false;
                                }
                            });
                        }
                    }
                    return false;
                }
            });
            if (!hasFirstCoachReserved && secondCoach) {
                $tr.each(function() {
                    if($(this).children("td").first().text() == secondCoach) {
                        var $eventLine = $(this).children("td").last().children(".dhx_matrix_line").children(".dhx_cal_event_line");
                        if ($eventLine.length) {
                            var hasFirstLeftReserved = false;
                            $eventLine.each(function() {
                                if (str2num($(this).css("left")) + str2num(leftArray[0]) - str2num(leftArray[timeArray.indexOf(firstTime)]) == 1) {
                                    $(this).click();
                                    afterTimeClick();
                                    hasFirstLeftReserved = true;
                                    hasSecondCoachReserved = true;
                                    // console.log(secondCoach + "  " + firstTime);
                                    return false;
                                }
                            });
                            if (!hasFirstLeftReserved && secondTime || canTwoTime) {
                                $eventLine.each(function() {
                                    if (str2num($(this).css("left")) + str2num(leftArray[0]) - str2num(leftArray[timeArray.indexOf(secondTime)]) == 1) {
                                        $(this).click();
                                        afterTimeClick();
                                        hasSecondCoachReserved = true;
                                        // console.log(secondCoach + "  " + secondTime);
                                        return false;
                                    }
                                });
                            }
                        }
                        return false;
                    }
                });
            }
            if (hasFirstCoachReserved || hasSecondCoachReserved) {
                sendMessageRequest("3", "");
            } else {
                sendMessageRequest("2", "");
            }
            hasReserved = true;
        }

        chrome.storage.local.get('isRunning', function (result) {
            if (!result.isRunning) {
                clearInterval(int);
            }
        });
    }, 250);
}

function str2num(str) {
    return parseInt(str.substr(0, str.length - 2));
}

function afterTimeClick() {
    var int1 = setInterval(function() {
        if ($("#LearnInfo_executeButton").length) {
            $("#LearnInfo_executeButton").get(0).click();
        }
        if ($("div.window").css("display") == "none") {
            clearInterval(int1);
            var int2flag = false;
            var int2 = setInterval(function() {
                if ($(".messager-window").length || $(".window-shadow").length || $(".window-mask").length) {
                    int2flag = true;
                    // $(".messager-window").children(".panel-header").children(".panel-tool").children(".panel-tool-close").first().get(0).click();
                    $(".messager-window").remove();
                    $(".window-shadow").remove();
                    $(".window-mask").remove();
                } else {
                    if (int2flag) {
                        clearInterval(int2);
                        var int3flag = false;
                        var int3 = setInterval(function() {
                            if ($("#thumbviewbox").length) {
                                int3flag = true;
                                // $("#thumbviewbox").children(".close").first().get(0).click();
                                $("#thumbviewbox").remove();
                            } else {
                                if (int3flag) {
                                    clearInterval(int3);
                                }
                            }
                        }, 25);
                    }
                }
            }, 25);
        }
    }, 100);
}