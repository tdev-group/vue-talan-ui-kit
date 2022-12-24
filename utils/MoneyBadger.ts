export default class MoneyBadger {
    /**
     * Gets the progress of the value regarding total value.
     *
     * @param value Value.
     * @param total Total value.
     */
    public static getProgress(value: number, total: number) {
        // If value more than total then return max value.
        if (value > total) {
            return 100;
        }

        if (total === 0) {
            return 0;
        }

        return Math.round((value * 100) / total);
    }

    /**
     * Rounds the value to max value if the value more than the value.
     *
     * @param value Rounded value.
     * @param max Max value.
     */
    public static roundToValue(value: number, max: number) {
        return value >= max ? max : value;
    }
}
