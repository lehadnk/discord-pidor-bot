module.exports = {

    GetRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    async AsyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    },

    Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}