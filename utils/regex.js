const youtubeLinksRegex = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?$/g;
const threeDigitNumber = /^[1-9]{1,3}$/g;

class RegexMatch {
        matchYoutubeLink(input) {
                return input.match(youtubeLinksRegex);
        }
        matchThreeDigitNumber(input) {
                return input.match(threeDigitNumber);
        }
}

module.exports = new RegexMatch();