'use strict';

function pluralize_(number, result, words) {
    if (number == 0) {
        return result;
    }
    if ((number >= 5 && number < 21)) {
        result += number + ' ' + words[2] + ' ';
    } else if ((number % 10) == 1) {
        result += number + ' ' + words[0] + ' ';
    } else if ((number % 10) === 0) {
        result += number + ' ' + words[2] + ' ';
    } else if ((number % 10) < 5) {
        result += number + ' ' + words[1] + ' ';
    } else if ((number % 10) >= 5) {
        result += number + ' ' + words[2] + ' ';
    }
    return result;
}
function pluralize(days, hours, minutes) {
    var result = 'До ограбления осталось ';
    result = pluralize_(days, result, ['день', 'дня', 'дней']);
    result = pluralize_(hours, result, ['час', 'часа', 'часов']);
    result = pluralize_(minutes, result, ['минута', 'минуты', 'минут']);
    return result;
}

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            var localDate = new Date(this.date - (-this.timezone * 1000 * 3600));
            var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            var hours = (localDate.getHours() < 10 ?
                '0' + localDate.getHours() :
                localDate.getHours()
            );
            var mins = (localDate.getMinutes() < 10 ?
                '0' + localDate.getMinutes() :
                localDate.getMinutes()
            );
            var result = pattern.replace('%DD', days[localDate.getDay()]);
            result = result.replace('%HH', hours);
            return result.replace('%MM', mins);
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            //console.log(this.date);
            //console.log(moment.date);
            var tempDate = new Date(this.date - moment.date);
            var days = Math.floor(tempDate.getTime() / (1000 * 60 * 60 * 24));
            var hours = Math.floor(tempDate.getTime() / (1000 * 60 * 60)) % 24;
            var minutes = Math.floor(tempDate.getTime() / (1000 * 60)) % 60;
            //console.log(days, hours, minutes);
            return pluralize(days, hours, minutes);
        }
    };
};
