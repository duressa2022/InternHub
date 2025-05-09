export function showNotification(message, type = "success") {
  const container = document.getElementById("notificationContainer");
  if (!container) return;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-400 text-black",
    info: "bg-blue-500",
  };

  // Create notification
  const notification = document.createElement("div");
  notification.className = `
    flex flex-col gap-2 p-4 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full opacity-0
    ${bgColors[type] || bgColors.info}
  `;

  // Notification content with icon and close button
  notification.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex gap-2 items-start">
        <div class="text-xl">${icons[type] || "ℹ️"}</div>
        <div class="text-sm leading-snug">${message}</div>
      </div>
      <button class="text-xl ml-4 focus:outline-none hover:opacity-75">&times;</button>
    </div>
    <div class="h-1 bg-white bg-opacity-30 rounded overflow-hidden">
      <div class="progress-bar h-full bg-white w-0"></div>
    </div>
  `;

  container.appendChild(notification);

  // Animate entrance
  requestAnimationFrame(() => {
    notification.classList.remove("translate-x-full", "opacity-0");
    notification.classList.add("translate-x-0", "opacity-100");
  });

  // Animate progress bar
  const progressBar = notification.querySelector(".progress-bar");
  progressBar.style.transition = "width 5s linear";
  requestAnimationFrame(() => {
    progressBar.style.width = "100%";
  });

  // Handle close button
  const closeBtn = notification.querySelector("button");
  closeBtn.addEventListener("click", () => dismiss(notification));

  // Auto-dismiss after 5s
  setTimeout(() => dismiss(notification), 5000);

  function dismiss(el) {
    el.classList.remove("opacity-100", "translate-x-0");
    el.classList.add("opacity-0", "translate-x-full");
    setTimeout(() => el.remove(), 300);
  }
}
