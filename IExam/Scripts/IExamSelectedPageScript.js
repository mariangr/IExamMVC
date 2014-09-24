var IExamSelectedTest = IExamSelectedTest || {};

$(document).ready(function () {


})

IExamSelectedTest.TestAnswersVM = function (testID, questionID, selectedAnswer) {
    var self = this;

    self.TestID = testID;
    self.QuestionID = questionID;
    self.SelectedAnswer = selectedAnswer;
}

IExamSelectedTest.PageLogic = function () {
    var sendAnswers = function (event) {
        var testId = $(event.target).attr('id');
        var questions = $('.questionForm');
        var AllAnswers = [];

        for (var questionI in questions) {
            var questionID = $(questions[questionI]).attr('id');
            var answers = $(questions[questionI]).find('input');
            console.dir(answers)
            for (var answerI in answers) {
                var answer = 0;
                if ($(answers[answerI]).is(':checked')) {
                    var answer = $(answers[answerI]).val();
                    break;
                }
                if (answerI == 3) {
                    break;
                }
            }
            var newAnswer = new IExamSelectedTest.TestAnswersVM(testId, questionID, answer);
            AllAnswers.push(newAnswer);

            if (questionI == questions.length - 1)
            {
                break;
            }
        }

        $.ajax({
            type: 'POST',
            url: '/Tests/CheckAnswers/',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: '{ "AllAnswers":' + JSON.stringify(AllAnswers) + '}',
            success: function (result) {
                alert('You have: ' + result.TestRightQuestionsNumber + "/" + result.TestQuestionNumber + " right answers");
            },
            error: function (result) {
                alert(result);
            }
        })
    }

    return {
        sendAnswers: sendAnswers,
    }
}();