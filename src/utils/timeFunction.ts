import moment from 'moment';

export function formatTime(time: string, format = 'YYYY-MM-DD HH:mm:ss') {
    return moment(time).format(format);
}