export default function handleDelete() {
  jobsDiv = document.getElementById("jobs");

  jobsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === deleteJob) {
        enableInput(false);

        try {
          const response = await fetch(
            `/api/v1/jobs/${addEditDiv.dataset.id}`, // Fixed reference here
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.status === 200) {
            message.textContent = "The job entry was deleted.";

            // Remove the job from the UI (if it's on the job list page)
            const jobElement = document.querySelector(
              `[data-job-id="${addEditDiv.dataset.id}"]` // Use dataset.id for the job ID
            );
            if (jobElement) {
              jobElement.remove();
            }

            // Optionally, you can refresh the job list
            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      }
    }
  });
}