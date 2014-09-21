var IExamIndex = IExamIndex || {};

$(document).ready(function () {
    IExamIndex.Tests = new IExamIndex.TestsModel();
    ko.applyBindings(IExamIndex.Tests, document.getElementById(test_data))
    IExamIndex.PageLogic.FillTestTable();
    $('#requirmentName').hide();
})

IExamIndex.TestsModel = function () {
    var self = this;

    self.tests = ko.observableArray([]);

}

IExamIndex.TestVM = function (id, name) {
    var self = this;

    self.id = ko.observable(id);
    self.name = ko.observable(name);
}

IExamIndex.PageLogic = function () {
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
                    tempArray.push(new IExamIndex.TestVM(
                        tableResult[userI].TestID,
                        tableResult[userI].TestName
                        ))
                }
                IExamIndex.Tests.tests.removeAll();
                ko.utils.arrayPushAll(IExamIndex.Tests.tests(), tempArray);
                IExamIndex.Tests.tests.valueHasMutated();
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

    return {
        DeleteTest: DeleteTest,
        FillTestTable: FillTestTable,
        CreateTest: CreateTest
        
    }
}();