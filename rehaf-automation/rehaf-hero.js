export function initRehafHero(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="hero flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
      
      <!-- Left Text Section -->
      <div class="text-left max-w-xl">
        <h1 class="text-4xl md:text-5xl font-bold leading-tight">
          Create Hundreds of <span class="text-purple-500">AI Employees</span><br>
          Inside <span class="text-blue-500">REHAF's</span> Work Platform
        </h1>
        <p class="mt-6 text-gray-600 text-lg">
          Manage all Human Work and AI Work in a single platform with seamless handoff.
        </p>
        <div class="mt-8 flex gap-4">
          <button class="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
            Try REHAF for Free
          </button>
          <button class="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
            Contact Sales
          </button>
        </div>
      </div>

      <!-- Right Mascot Section -->
      <div class="mt-10 md:mt-0 bg-white rounded-2xl shadow-lg p-6 text-center w-80">
        <video class="mx-auto w-24 h-24 rounded-full" autoplay loop muted playsinline>
          <source src="assets/mascotvideo.webm" type="video/webm">
          Your browser does not support the video tag.
        </video>
        <div class="mt-4 font-semibold text-purple-600">AI Executive Assistant</div>
        <ul class="mt-3 text-gray-600 text-sm space-y-1">
          <li>○ Draft Emails</li>
          <li>○ Take Meeting Notes</li>
          <li>○ Create Schedule</li>
          <li>○ Prioritize Tasks</li>
        </ul>
        <button class="mt-6 px-6 py-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200">
          Onboard
        </button>
      </div>
    </section>
  `;
}
