﻿function FirstRunViewModel() {
    var self = this;

    self.username = ko.observable(undefined);
    self.password = ko.observable(undefined);
    self.confirmedPassword = ko.observable(undefined);

    self.passwordMismatch = ko.computed(function() {
        return self.password() != self.confirmedPassword();
    });

    self.validUsername = ko.computed(function() {
        return self.username() && self.username().trim() != "";
    });

    self.validPassword = ko.computed(function() {
        return self.password() && self.password().trim() != "";
    });

    self.validData = ko.computed(function() {
        return !self.passwordMismatch() && self.validUsername() && self.validPassword();
    });

    self.keepAccessControl = function() {
        if (!self.validData()) return;

        var data = {
            "ac": true,
            "user": self.username(),
            "pass1": self.password(),
            "pass2": self.confirmedPassword()
        };
        self._sendData(data);
    };

    self.disableAccessControl = function() {
        $("#confirmation_dialog .confirmation_dialog_message").html("如果您关闭权限控制<strong>并且</strong>您的打印机" +
            "可以从互联网直接访问，这意味着它<strong>可能被任何一个人访问——" +
            "甚至也包括一些不怀好意者！</strong>");
        $("#confirmation_dialog .confirmation_dialog_acknowledge").unbind("click");
        $("#confirmation_dialog .confirmation_dialog_acknowledge").click(function(e) {
            e.preventDefault();
            $("#confirmation_dialog").modal("hide");

            var data = {
                "ac": false
            };
            self._sendData(data, function() {
                // if the user indeed disables access control, we'll need to reload the page for this to take effect
                location.reload();
            });
        });
        $("#confirmation_dialog").modal("show");
    };

    self._sendData = function(data, callback) {
        $.ajax({
            url: API_BASEURL + "setup",
            type: "POST",
            dataType: "json",
            data: data,
            success: function() {
                self.closeDialog();
                if (callback) callback();
            }
        });
    }

    self.showDialog = function() {
        $("#first_run_dialog").modal("show");
    }

    self.closeDialog = function() {
        $("#first_run_dialog").modal("hide");
    }
}