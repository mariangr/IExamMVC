/// <reference path="../../jquery-2.1.1.js" />
var IExamTestQuestion = IExamTestQuestion || {};



IExamTestQuestion.PageLogic = function () {
    var DeleteQuestion = function (event, questionID, testID) {
        $.ajax({
            type: 'POST',
            url: '/Tests/DeleteTestQuestions/',
            data: { id: questionID },
            success: function (result) {
                IExamTestIndex.PageLogic.ShowQestions(null, testID);

            },
            error: function (result) {
                alert(result);
            }
        })
    }

    var AddQuestion = function (event) {
        var id = $(event.target).attr('id');
        var question = $('#newTestQuestion' + id).val();
        var first = $('#newTestFirstAnswer' + id).val();
        var second = $('#newTestSecondAnswer' + id).val();
        var third = $('#newTestThirdAnswer' + id).val();
        var fourth = $('#newTestFourthAnswer' + id).val();
        var answer = $('#newTestAnswer' + id).val();
        if (question != "" && first != "" && second != "" && third != "" && fourth != "") {
            $.ajax({
                type: 'POST',
                url: '/Tests/AddTestQuestions/',
                data: { TestID: id, QuestionDescription: question, FirstAnswer: first, SecondAnswer: second, ThirdAnswer: third, FourthAnswer: fourth, Answer: answer },
                success: function (result) {
                    IExamTestIndex.PageLogic.ShowQestions(null, id);
                    $('#newTestQuestion' + id).val("");
                    $('#newTestFirstAnswer' + id).val("");
                    $('#newTestSecondAnswer' + id).val("");
                    $('#newTestThirdAnswer' + id).val("");
                    $('#newTestFourthAnswer' + id).val("");
                    $('#newTestAnswer' + id).val("1");
                },
                error: function (result) {
                    alert(result);
                }
            })
        }
    }

    return {
        DeleteQuestion: DeleteQuestion,
        AddQuestion: AddQuestion
    }

}()
