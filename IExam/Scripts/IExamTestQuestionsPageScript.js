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

    return {
        DeleteQuestion: DeleteQuestion
    }

}()
