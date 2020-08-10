/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const Issues = require("../models/issues");

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      const query = req.query;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.query;

      if (Object.keys(query).length === 0) {
        //no query returns all issues
        Issues.find({}, (err, issues) => {
          if (err) {
            return res.send("error finding issues");
          }
          return res.send(issues);
        });
      } else {
        Issues.find({}, (err, issues) => {
          if (issue_title) {
            issues = issues.filter(issue => {
              return issue.issue_title === issue_title;
            });
          }
          if (issue_text) {
            issues = issues.filter(issue => {
              return issue.issue_text === issue_text;
            });
          }
          if (created_by) {
            issues = issues.filter(issue => {
              return issue.created_by === created_by;
            });
          }
          if (assigned_to) {
            issues = issues.filter(issue => {
              return issue.assigned_to === assigned_to;
            });
          }
          if (status_text) {
            issues = issues.filter(issue => {
              return issue.status_text === status_text;
            });
          }
          if (open) {
            console.log("open");
            issues = issues.filter(issue => {
              return issue.open.toString() === open;
            });
          }

          return res.send(issues);
        });
      }
    })

    .post(function(req, res) {
      console.log("hll");
      //console.log(req.body)
      var project = req.params.project;
      console.log(req.body.issue_title);
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
      //console.log(req.body.issue_title);
      if (
        issue_title == undefined ||
        issue_text == undefined ||
        created_by == undefined
      ) {
        console.log("herehere");
        let emptyResult = { failure: "Missing required info" };
        console.log(emptyResult);
        res.status(500);
        return res.json(emptyResult);
      }
      let newIssue = new Issues({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text,
        open: true
      });
      newIssue.save((err, result) => {
        if (err) {
          res.json(err);
        } else {
          result = result.toObject();
          res.json(result);
        }
      });
    })

    .put(function(req, res) {
      var project = req.params.project;

      const _id = req.body._id || "",
        issue_title = req.body.issue_title || "",
        issue_text = req.body.issue_text || "",
        created_by = req.body.created_by || "",
        assigned_to = req.body.assigned_to || "",
        status_text = req.body.status_text || "",
        open = req.body.open || "";

      if (!_id) {
        return res.send(`no ID sent`);
      }

      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.send(`no updated field sent`);
      }

      Issues.findById(_id, (err, issue) => {
        if (err || !issue) {
          return res.send(`could not update ${_id}`);
        }

        //update issue fields that have new info
        issue.updated_on = new Date();
        if (issue_title) {
          issue.issue_title = issue_title;
        }
        if (issue_text) {
          issue.issue_text = issue_text;
        }
        if (created_by) {
          issue.created_by = created_by;
        }
        if (assigned_to) {
          issue.assigned_to = assigned_to;
        }
        if (status_text) {
          issue.status_text = status_text;
        }
        open ? (issue.open = false) : (issue.open = true);

        issue.save((err, data) => {
          if (err) {
            return res.json({ failure: `Could not save` });
          }
          return res.send("successfully updated");
        });
      });
    })

    .delete(function(req, res) {
      var project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.send("_id error");
      }

      Issues.deleteOne({ _id: _id }, function(err) {
        if (err) {
          res.status(500);
          return res.send(`could not delete ${_id}`);
        }
        return res.send(`deleted ${_id}`);
      });
    });
};
