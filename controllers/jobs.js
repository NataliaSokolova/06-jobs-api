import {
    inputEnabled,
    setDiv,
    message,
    token,
    enableInput,
  } from "./index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showAddEdit } from "./addEdit.js";
  
  let jobsDiv = null;
  let jobsTable = null;
  let jobsTableHeader = null;
  
  export const handleJobs = () => {
    jobsDiv = document.getElementById("jobs");
    const logoff = document.getElementById("logoff");
    const addJob = document.getElementById("add-job");
    jobsTable = document.getElementById("jobs-table");
    jobsTableHeader = document.getElementById("jobs-table-header");
  
    logoff.addEventListener("click", (e) => {
      if (inputEnabled) {
        e.preventDefault();
        setToken(null);
        message.textContent = "You have been logged off.";
        jobsTable.replaceChildren([jobsTableHeader]);
        showLoginRegister();
      }
    });
  
    addJob.addEventListener("click", (e) => {
      if (inputEnabled) {
        e.preventDefault();
        showAddEdit(null);
      }
    });
  };
  
  export const showJobs = async () => {
    try {
      enableInput(false);
      const response = await fetch("/api/v1/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
  
      if (response.status === 200) {
        let children = [jobsTableHeader];
        if (data.count === 0) {
          jobsTable.replaceChildren(...children); // clear this for safety
        } else {
          for (let i = 0; i < data.jobs.length; i++) {
            let rowEntry = document.createElement("tr");
            let editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "editButton";
            editButton.dataset.id = data.jobs[i]._id;
            editButton.textContent = "edit";
  
            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "deleteButton";
            deleteButton.dataset.id = data.jobs[i]._id;
            deleteButton.textContent = "delete";
  
            rowEntry.innerHTML = `
              <td>${data.jobs[i].company}</td>
              <td>${data.jobs[i].position}</td>
              <td>${data.jobs[i].status}</td>
            `;
            let buttonsCell = document.createElement("td");
            buttonsCell.appendChild(editButton);
            buttonsCell.appendChild(deleteButton);
            rowEntry.appendChild(buttonsCell);
  
            children.push(rowEntry);
          }
          jobsTable.replaceChildren(...children);
  
          // Add event listeners for edit and delete buttons
          const editButtons = document.querySelectorAll(".editButton");
          editButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
              message.textContent = "";
              showAddEdit(e.target.dataset.id);
            });
          });
  
          const deleteButtons = document.querySelectorAll(".deleteButton");
          deleteButtons.forEach((button) => {
            button.addEventListener("click", async (e) => {
              const jobId = e.target.dataset.id;
              try {
                const response = await fetch(`/api/v1/jobs/${jobId}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });
                const data = await response.json();
                if (response.status === 200) {
                  message.textContent = "The job entry was deleted.";
                  showJobs(); // Refresh the jobs list after deletion
                } else {
                  message.textContent = data.msg;
                }
              } catch (err) {
                console.error(err);
                message.textContent = "A communication error occurred.";
              }
            });
          });
        }
      } else {
        message.textContent = data.msg || "Failed to fetch jobs.";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "A communication error occurred.";
    } finally {
      enableInput(true);
      setDiv(jobsDiv);
    }
  };