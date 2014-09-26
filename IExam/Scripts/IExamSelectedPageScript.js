var IExamSelectedTest = IExamSelectedTest || {};
IExamSelectedTest.SelectedTestVM = null;

$(document).ready(function () {
    IExamSelectedTest.SelectedTestVM = new IExamSelectedTest.SelectedTestModel();
    ko.applyBindings(IExamSelectedTest.SelectedTestVM, document.getElementById(selected_test_content));
    IExamSelectedTest.PageLogic.GetNumberOfTimesTestIsDone();
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
                GetNumberOfTimesTestIsDone();
                alert('You have: ' + result.TestRightQuestionsNumber + "/" + result.TestQuestionNumber + " right answers");
            },
            error: function (result) {
                alert(result);
            }
        })
    }

    var GetNumberOfTimesTestIsDone = function () {
        var testID = $('#hiddenForTestId').val();
        $.ajax({
            type: 'GET',
            url: '/Tests/GetNumberOfTimesTestDone/',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: { testID: testID},
            success: function (result) {
                IExamSelectedTest.SelectedTestVM.numberOfTimesTestIsDone(result.NumberOfTimesDone);
            },
            error: function (result) {
            }
        })

    }

    return {
        sendAnswers: sendAnswers,
        GetNumberOfTimesTestIsDone: GetNumberOfTimesTestIsDone
    }
}();

IExamSelectedTest.SelectedTestModel = function () {
    var self = this;

    self.numberOfTimesTestIsDone = ko.observable("You have done this test: 0 times");

}