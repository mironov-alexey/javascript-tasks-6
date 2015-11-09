'use strict';

function pluralize(days, hours, minutes) {
    var result = 'До ограбления осталось ';
    //var daysPlur = {1: 'день', 2: 'дня', 5: 'дней'}
    if ((days >= 5 && days < 21)) {
        result += days + ' дней, ';
    } else if (days > 1) {
        result += days + ' дня, ';
    } else if (days == 1) {
        result += days + ' день, ';
    } else if (days % 10 < 5) {
        result += days + ' дня, ';
    } else if (days % 10 >= 5) {
        result += days + ' дней, ';
    }
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
            var days = {0: 'ВС', 1: 'ПН', 2: 'ВТ', 3: 'СР', 4: 'ЧТ', 5: 'ПТ', 6: 'СБ'};
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
            console.log(this.date);
            console.log(moment.date);
            var tempDate = new Date(this.date - moment.date);
            var days = Math.floor(tempDate.getTime() / (1000 * 60 * 60 * 24));
            var hours = Math.floor(tempDate.getTime() / (1000 * 60 * 60)) % 24;
            var minutes = Math.floor(tempDate.getTime() / (1000 * 60)) % 60;
            console.log(days, hours, minutes);
            return pluralize(days, hours, minutes);
        }
    };
};
