var reservationDate, firstCoach, secondCoach, firstTime, secondTime, canTwoTime, isRunning;

$(function() {
    updateSetting();
    updateState();
    initDate();
    $("#startReservationBtn").on("click", function() {
        if (isRunning) {
            isRunning = false;
            afterStarted();
        } else {
            if (reservationDate && firstCoach && firstTime) {
                isRunning = true;
                afterStarted();
                chrome.tabs.executeScript(null, { file: 'lib/js/jquery.min.js' }, function() {
                    chrome.tabs.executeScript(null, { file: 'dist/js/script.min.js' });
                });
            } else {
                showNotification("设置错误", "请先设置教练和时段，再点击“开始预约”！");
            }
        }
    });
    $("#saveSettingBtn").on("click", function() {
        var reservation_date = parseInt($("#reservation_date").val());
        var first_coach = $("#first_coach").val();
        var second_coach = $("#second_coach").val();
        var first_time = $("#first_time").val();
        var second_time = $("#second_time").val();
        var can_two_time = $("#can_two_time").prop("checked");
        if (isValid(first_coach, second_coach, first_time, second_time, can_two_time)) {
            var count = 0;
            chrome.storage.local.set({'reservationDate': reservation_date}, function() {
                count++;
                if (count == 6) afterSaved();
            });
            chrome.storage.local.set({'firstCoach': first_coach}, function() {
                count++;
                if (count == 6) afterSaved();
            });
            chrome.storage.local.set({'secondCoach': second_coach}, function() {
                count++;
                if (count == 6) afterSaved();
            });
            chrome.storage.local.set({'firstTime': first_time}, function() {
                count++;
                if (count == 6) afterSaved();
            });
            chrome.storage.local.set({'secondTime': second_time}, function() {
                count++;
                if (count == 6) afterSaved();
            });
            chrome.storage.local.set({'canTwoTime': can_two_time}, function() {
                count++;
                if (count == 6) afterSaved();
            });
        }
    });
    chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {
        var response = {};
        switch (request.type) {
            case "-1": {
                $.ajax({
                    url: 'http://zhjp.atsjtu.cc/',
                    type: "post",
                    dataType: "json",
                    data: {
                        drivingSchool: request.message,
                        reservationDate: moment().add(reservationDate, 'days').format('YYYY-MM-DD'),
                        firstCoach: firstCoach,
                        secondCoach: secondCoach,
                        firstTime: firstTime,
                        secondTime: secondTime,
                        canTwoTime: canTwoTime ? 1 : 0
                    },
                    success: function(data) {

                    }
                });
                response.type = "-1";
                response.status = "success";
                break;
            }
            case "0": {
                showNotification("页面错误", "请先进入“培训预约”页面，再点击“开始预约”！");
                response.type = "0";
                response.status = "success";
                break;
            }
            case "1": {
                showNotification("页面错误", "请先选择科目进入具体页面，再点击“开始预约”！");
                response.type = "1";
                response.status = "success";
                break;
            }
            case "2": {
                showNotification("预约失败", "请更改教练或时段，重新点击“开始预约”！");
                response.type = "2";
                response.status = "success";
                break;
            }
            case "3": {
                showNotification("预约成功", "请前往“个人信息”-->“预约记录”查看确认！");
                response.type = "3";
                response.status = "success";
                break;
            }
            default:
        }
        updateState();
        sendResponse(response);
    });
});

function updateState() {
    chrome.storage.local.get('isRunning', function (result) {
        isRunning = result.isRunning;
        if (isRunning) {
            $("#startReservationBtn").removeClass("btn-primary").addClass("btn-warning").text("停止预约");
            $("#startReservationBtn").next().text("正在预约中...");
        } else {
            $("#startReservationBtn").removeClass("btn-warning").addClass("btn-primary").text("开始预约");
            $("#startReservationBtn").next().text("");
        }
    });
}

function afterStarted() {
    chrome.storage.local.set({'isRunning': isRunning}, function() {
        updateState();
    });
}

function updateSetting() {
    chrome.storage.local.get('reservationDate', function (result) {
        reservationDate = result.reservationDate;
        if (reservationDate) {
            switch (reservationDate) {
                case 7: {
                    $("#reservationDate").text("7天后 (" + moment().add(7, 'days').format('M月D日') + ")");
                    break;
                }
                case 6: {
                    $("#reservationDate").text("6天后 (" + moment().add(6, 'days').format('M月D日') + ")");
                    break;
                }
                case 5: {
                    $("#reservationDate").text("5天后 (" + moment().add(5, 'days').format('M月D日') + ")");
                    break;
                }
                case 4: {
                    $("#reservationDate").text("4天后 (" + moment().add(4, 'days').format('M月D日') + ")");
                    break;
                }
                case 3: {
                    $("#reservationDate").text("大后天 (" + moment().add(3, 'days').format('M月D日') + ")");
                    break;
                }
                case 2: {
                    $("#reservationDate").text("后天 (" + moment().add(2, 'days').format('M月D日') + ")");
                    break;
                }
                case 1: {
                    $("#reservationDate").text("明天 (" + moment().add(1, 'days').format('M月D日') + ")");
                    break;
                }
                default:
            }
        } else {
            $("#reservationDate").text("7天后 (" + moment().add(7, 'days').format('M月D日') + ")");
        }
    });
    chrome.storage.local.get('firstCoach', function (result) {
        firstCoach = result.firstCoach;
        if (firstCoach) {
            $("#firstCoach").text(firstCoach);
        } else {
            $("#firstCoach").text("未填写");
        }
    });
    chrome.storage.local.get('secondCoach', function (result) {
        secondCoach = result.secondCoach;
        if (secondCoach) {
            $("#secondCoach").text(secondCoach);
        } else {
            $("#secondCoach").text("未填写");
        }
    });
    chrome.storage.local.get('firstTime', function (result) {
        firstTime = result.firstTime;
        if (firstTime) {
            $("#firstTime").text(firstTime);
        } else {
            $("#firstTime").text("未选择");
        }
    });
    chrome.storage.local.get('secondTime', function (result) {
        secondTime = result.secondTime;
        if (secondTime) {
            $("#secondTime").text(secondTime);
        } else {
            $("#secondTime").text("未选择");
        }
    });
    chrome.storage.local.get('canTwoTime', function (result) {
        canTwoTime = result.canTwoTime;
        if (canTwoTime) {
            $("#canTwoTime").text("是");
        } else {
            $("#canTwoTime").text("否");
        }
    });
}

function afterSaved() {
    updateSetting();
    $("#saveSettingBtn").removeClass("btn-primary").addClass("btn-success").text("设置已保存");
    setTimeout(function() {
        $("#saveSettingBtn").removeClass("btn-success").addClass("btn-primary").text("保存设置");
    }, 1000);
}

function initDate() {
    $("#reservation_date").children("option").each(function() {
        switch ($(this).val()) {
            case "7": {
                $(this).text("7天后 (" + moment().add(7, 'days').format('M月D日') + ")");
                break;
            }
            case "6": {
                $(this).text("6天后 (" + moment().add(6, 'days').format('M月D日') + ")");
                break;
            }
            case "5": {
                $(this).text("5天后 (" + moment().add(5, 'days').format('M月D日') + ")");
                break;
            }
            case "4": {
                $(this).text("4天后 (" + moment().add(4, 'days').format('M月D日') + ")");
                break;
            }
            case "3": {
                $(this).text("大后天 (" + moment().add(3, 'days').format('M月D日') + ")");
                break;
            }
            case "2": {
                $(this).text("后天 (" + moment().add(2, 'days').format('M月D日') + ")");
                break;
            }
            case "1": {
                $(this).text("明天 (" + moment().add(1, 'days').format('M月D日') + ")");
                break;
            }
            default:
        }
    });
}

function isValid(first_coach, second_coach, first_time, second_time, can_two_time) {
    $("#setting").children(".form-group").each(function() {
        $(this).removeClass("has-error");
        $(this).find(".help-block").text("");
    });
    var isValid = true;
    var is_first_coach_valid = true;
    if (first_coach) {
        if (!isChinese(first_coach) || first_coach.length < 2 || first_coach.length > 4) {
            isValid = false;
            is_first_coach_valid = false;
            $("#first_coach").next().text("第一教练名字不规范");
            $("#first_coach").parent().parent().addClass("has-error");
        }
    } else {
        isValid = false;
        is_first_coach_valid = false;
        $("#first_coach").next().text("请填写第一教练");
        $("#first_coach").parent().parent().addClass("has-error");
    }
    if (second_coach.length > 1 || second_coach.length < 5) {
        if (isChinese(second_coach)) {
            if (is_first_coach_valid && first_coach == second_coach) {
                isValid = false;
                $("#second_coach").next().text("第二教练与第一教练不能相同");
                $("#second_coach").parent().parent().addClass("has-error");
            }
        } else {
            isValid = false;
            $("#second_coach").next().text("第二教练名字不规范");
            $("#second_coach").parent().parent().addClass("has-error");
        }
    }
    if (first_time) {
        if (second_time) {
            if (first_time == second_time) {
                isValid = false;
                $("#second_time").next().text("第二时段与第一时段不能相同");
                $("#second_time").parent().parent().addClass("has-error");
            } else {
                if (can_two_time && Math.abs(parseInt(first_time.substr(0, 2)) - parseInt(second_time.substr(0, 2))) == 2) {
                    isValid = false;
                    $("#second_time").next().text("两个时段不能连续");
                    $("#second_time").parent().parent().addClass("has-error");
                }
            }
        } else {
            if (can_two_time) {
                $("#second_time").next().text("请选择第二时段");
                $("#second_time").parent().parent().addClass("has-error");
            }
        }
    } else {
        isValid = false;
        $("#first_time").next().text("请选择第一时段");
        $("#first_time").parent().parent().addClass("has-error");
    }
    return isValid;
}

function isChinese(str) {
    var reg = /[^\u4e00-\u9fa5]/;
    if (reg.test(str)) return false;
    return true;
}

function showNotification(title, message) {
    var options = {
        type : "basic",
        title: title,
        message: message,
        iconUrl: "images/icon_48.png"
    };
    chrome.notifications.create("start", options, function(notId) {
        setTimeout(function() {
            chrome.notifications.clear(notId);
        }, 5000);
    });
}