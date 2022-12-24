const red = 'progress--red';
const green = 'progress--green';
const orange = 'progress--orange';

export function getProgressColorClassName(progress: number): string {
    if (progress < 30) {
        return red;
    } else if (progress < 70) {
        return orange;
    }

    return green;
}
