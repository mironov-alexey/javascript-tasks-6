'use strict';

var moment = require('./moment');
function getUTCDate(input) {
    var days = {'ПН': 9, 'ВТ': 10, 'СР': 11};
    var day = input.substring(0, 2);
    var hours = parseInt(input.substring(3, 5));
    var minutes = parseInt(input.substring(6, 8));
    var timezoneOffset = parseInt(input.substring(8));
    var localDate = new Date(2015, 10, days[day], hours, minutes);
    return new Date(localDate - (timezoneOffset * 1000 * 3600));
}

function getUTCWorkingHours(workingHours) {
    var fromHours = parseInt(workingHours.from.substring(0, 2));
    var fromMinutes = parseInt(workingHours.from.substring(3, 5));
    var fromTimezoneOffset = parseInt(workingHours.from.substring(6));
    var fromLocalTime = new Date(2015, 10, 9, fromHours, fromMinutes);
    var toHours = parseInt(workingHours.to.substring(0, 2));
    var toMinutes = parseInt(workingHours.to.substring(3, 5));
    var toTimezoneOffset = parseInt(workingHours.to.substring(6));
    var toLocalTime = new Date(2015, 10, 9, toHours, toMinutes);
    return [new Date(fromLocalTime - (fromTimezoneOffset * 1000 * 3600)),
        new Date(toLocalTime - (toTimezoneOffset * 1000 * 3600))];
}

// Выбирает подходящий ближайший момент начала ограбления
function getBusySegments(obj) {
    var busySegments = [];
    for (var name in obj) {
        for (var i = 0; i < obj[name].length; i++) {
            var from = getUTCDate(obj[name][i].from);
            var to = getUTCDate(obj[name][i].to);
            var fromMinutes = ((from.getDay() - 1) * 24 * 60 + from.getHours() * 60 +
            from.getMinutes());
            var toMinutes = (to.getDay() - 1) * 24 * 60 + to.getHours() * 60 + to.getMinutes();
            busySegments.push([fromMinutes, toMinutes]);
        }
    }
    return busySegments;
}
function getWorkingSegments(utcWorkingHours) {
    var workingSegments = [];
    for (var i = 0; i <= 2; i++) {
        var start = (i * 24 * 60 + utcWorkingHours[0].getHours() * 60 +
            utcWorkingHours[0].getMinutes());
        var end = (i * 24 * 60 + utcWorkingHours[1].getHours() * 60 +
            utcWorkingHours[1].getMinutes());
        workingSegments.push([start, end]);
    }
    return workingSegments;
}

function findAppropriateTime(minDuration, workingSegments, busySegments) {
    for (var i = 0; i < 72 * 60; i += 1) {
        var currentSeg = [i, i + minDuration];
        var inWorking = inWorkingHours(currentSeg, workingSegments);
        var isValidSeg = isValid(currentSeg, busySegments);
        if (inWorking && isValidSeg) {
            return currentSeg;
        }
    }
    return null;
}

function parseFromMinutesToDate(resultSegment, days) {
    var day = Math.floor(resultSegment[0] / (24 * 60));
    var hours = Math.floor(resultSegment[0] / 60) % 24;
    var minutes = resultSegment[0] - (day * 24 + hours) * 60;
    return new Date(2015, 10, days[day], hours, minutes);
}

module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    appropriateMoment.timezone = parseInt(workingHours.from.substring(5));
    var utcWorkingHours = getUTCWorkingHours(workingHours);
    // 1. Читаем json
    var obj = JSON.parse(json);
    var workingSegments = getWorkingSegments(utcWorkingHours);
    //adjustWorkingSegments(workingSegments, appropriateMoment.timezone);
    var busySegments = getBusySegments(obj);
    // 2. Находим подходящий ближайший момент начала ограбления
    var resultSegment = findAppropriateTime(minDuration, workingSegments, busySegments);
    var date;
    var days = {0: 9, 1: 10, 2: 11};

    if (resultSegment) {
        date = parseFromMinutesToDate(resultSegment, days);
    }
    // 3. И записываем в appropriateMoment
    appropriateMoment.date = date;
    return appropriateMoment;
};

function isValid(segment, busySegments) {
    return busySegments.every(seg => {
        return !areIntersected(segment, seg);
    });
}
//текущий отрезок // один из отрезков-занятости
function areIntersected(segment1, segment2) {
    var inside = isInside(segment2, segment1) || isInside(segment1, segment2);
    var intersected = (segment2[0] < segment1[1] && segment1[1] < segment2[1]) ||
        (segment2[0] < segment1[0] && segment1[0] < segment2[1]);
    return inside || intersected;
}

function isInside(segment1, segment2) {
    return segment2[0] <= segment1[0] && segment1[1] <= segment2[1];
}

function inWorkingHours(segment, workingSegments) {
    return workingSegments.some(seg => {
        return isInside(segment, seg);
    });
}

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (!robberyMoment.date) {
        throw 'Не найден подходящий момент для ограбления!';
    }
    moment.date = getUTCDate(moment.date);
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }
    return 'Ограбление уже идёт!';
};
