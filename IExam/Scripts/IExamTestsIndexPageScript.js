var IExamTestIndex = IExamTestIndex || {};

$(document).ready(function () {
    IExamTestIndex.Tests = new IExamTestIndex.TestsModel();
    ko.applyBindings(IExamTestIndex.Tests, document.getElementById(test_data))
    IExamTestIndex.PageLogic.FillTestTable();
    $('#requirmentName').hide();
})

IExamTestIndex.TestsModel = function () {
    var self = this;

    self.tests = ko.observableArray([]);

}

IExamTestIndex.TestVM = function (id, name) {
    var self = this;

    self.id = ko.observable(id);
    self.name = ko.observable(name);
}

IExamTestIndex.PageLogic = function () {
    var DeleteTest = function (event) {
        var id = $(event.target).attr('id');
        $.ajax({
            type: 'POST',
            url: '/Tests/DeleteTest/',
            data: {id: id},
            success: function (success) {
                FillTestTable();
            },
            error: function () {
                alert('error');
            }
        })
    }

    var FillTestTable = function () {
        $.ajax({
            type: 'GET',
            url: '/Tests/GetTestData/',
            data: JSON,
            success: function (tableResult) {
                var tempArray = [];
                for (var userI in tableResult) {
                    tempArray.push(new IExamTestIndex.TestVM(
                        tableResult[userI].TestID,
                        tableResult[userI].TestName
                        ))
                }
                IExamTestIndex.Tests.tests.removeAll();
                ko.utils.arrayPushAll(IExamTestIndex.Tests.tests(), tempArray);
                IExamTestIndex.Tests.tests.valueHasMutated();
            },
            error: function () {
                alert('error');
            }
        })
    }

    var CreateTest = function () {
        var name = $('#testName').val();
        if (name.length > 0) {
            $.ajax({
                type: 'POST',
                url: '/Tests/CreateTest/',
                data: { name: name },
                success: function () {
                    $('#testName').val("");
                    FillTestTable();
                },
                error: function (result) {
                    alert(result);
                }
            })
        }
        else {
            $('#requirmentName').fadeIn(3000).fadeOut(1000);
        }
    }

    var ShowQestions = function (event, testID) {
        var id = testID || $(event.target).attr('id');
        $.ajax({
            type: 'GET',
            url: '/Tests/GetTestQuestions/',
            data: { id: id },
            success: function (result) {
                $('#previousQuestions' + id).html(result);
                $('#questionsContainer' + id).show();

            },
            error: function (result) {
                alert(result);
            }
        })

    }

    var CloseQuestions = function (event) {
        var id = $(event.target).attr('id');
        $('#questionsContainer' + id).hide();
    }

    return {
        DeleteTest: DeleteTest,
        FillTestTable: FillTestTable,
        CreateTest: CreateTest,
        ShowQestions: ShowQestions,
        CloseQuestions: CloseQuestions
        
    }
}();