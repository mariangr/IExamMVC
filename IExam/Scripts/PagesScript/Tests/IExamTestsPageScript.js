var IExamTests = IExamTests || {};
IExamTests.TestsVM = null;

$(document).ready(function () {
    IExamTests.TestsVM = new IExamTests.TestsModel();
    ko.applyBindings(IExamTests.TestsVM, document.getElementById(tests_container));
    IExamTests.PageLogic.fillTests();
})

IExamTests.TestsModel = function () {
    var self = this;
    
    self.tests = ko.observableArray([]);
}

IExamTests.TestVM = function (id, name) {
    var self = this;

    self.id = id;
    self.name = name;
    self.url = 'location.href="/Tests/TestQuestions?testId=' + id + '"';
}


IExamTests.PageLogic = function () {
    var fillTests = function () {
        $.ajax({
            type: 'GET',
            url: '/Tests/GetTestData/',
            data: JSON,
            success: function (tableResult) {
                var tempArray = [];
                for (var userI in tableResult) {
                    tempArray.push(new IExamTests.TestVM(
                        tableResult[userI].TestID,
                        tableResult[userI].TestName
                        ))
                }
                IExamTests.TestsVM.tests.removeAll();
                ko.utils.arrayPushAll(IExamTests.TestsVM.tests(), tempArray);
                IExamTests.TestsVM.tests.valueHasMutated();
            },
            error: function () {
                alert('error');
            }
        })

    }

    return {
        fillTests: fillTests
    }
}()