
function randomnumberonly(length) {
    const characters = '1234567890';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

module.exports = randomnumberonly;
