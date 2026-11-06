    (() => {
      const questions = [
        { key: "goal", icon: "✈️", title: () => "What is your primary goal for learning " + language() + "?", hint: "Choose the goal that matters most to you.", options: ["Travel & Culture", "Business & Career Advancement", "Exam Preparation (IELTS, TOEFL, DELE, etc.)", "Daily Conversation & Making Friends", "Moving to a New Country"] },
        { key: "level", icon: "🌱", title: () => "What is your current speaking level?", hint: "Pick the description that feels closest to you.", options: ["Absolute Beginner (I know basic greetings)", "Elementary / Pre-Intermediate (I can construct simple sentences)", "Intermediate (I can handle everyday topics comfortably)", "Advanced (I want to polish fluency and vocabulary)"] },
        { key: "nativeLanguage", icon: "🌍", title: () => "What is your native language?", hint: "This helps your tutor explain things clearly.", type: "select", options: ["English", "Spanish", "French", "German", "Portuguese", "Italian", "Arabic", "Chinese (Mandarin)", "Hindi", "Japanese", "Korean", "Russian", "Other"] },
        { key: "tutorStyle", icon: "💬", title: () => "How would you like your AI tutor to interact with you?", hint: "You can always adjust this later.", options: ["Supportive & Encouraging (Patience-focused)", "Strict & Precise (Focus on instant error correction)", "Casual & Friendly (Peer-to-peer chat style)", "Formal & Professional (Structured instruction)"] },
        { key: "ageGroup", icon: "🧭", title: () => "Which age group do you belong to?", hint: "This helps us tailor examples and topics.", options: ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"] },
        { key: "dailyPractice", icon: "⏱️", title: () => "How much time can you practice each day?", hint: "Small, consistent sessions make a difference.", options: ["5 minutes / day", "15 minutes / day", "30 minutes / day", "1 hour+ / day"] }
      ];
      const labels = { goal: "Primary goal", level: "Speaking level", nativeLanguage: "Native language", tutorStyle: "Tutor style", ageGroup: "Age group", dailyPractice: "Daily practice" };
      const state = {};
      let current = 0;
      const $ = (id) => document.getElementById(id);
      const language = () => $("learning-language").value;

      function render() {
        const q = questions[current];
        $("step-label").textContent = "STEP " + (current + 1) + " OF " + questions.length;
        $("progress-percent").textContent = Math.round((current + 1) / questions.length * 100) + "%";
        $("progress-fill").style.width = ((current + 1) / questions.length * 100) + "%";
        $("progress-fill").parentElement.setAttribute("aria-valuenow", current + 1);
        $("icon").textContent = q.icon;
        $("question").textContent = q.title();
        $("hint").textContent = q.hint;
        $("back").disabled = current === 0;
        const options = $("options");
        options.replaceChildren();

        if (q.type === "select") {
          const box = document.createElement("div");
          box.className = "rounded-2xl border border-[#dfe2d8] bg-white p-4 shadow-[0_8px_24px_rgba(31,47,37,.04)]";
          const select = document.createElement("select");
          select.className = "w-full cursor-pointer rounded-xl border border-[#e3e5dc] bg-[#fbfcf9] px-4 py-4 text-sm font-semibold text-[#304137]";
          select.setAttribute("aria-label", "Select your native language");
          const placeholder = new Option("Select your native language", "", true, true);
          placeholder.disabled = true;
          select.add(placeholder);
          q.options.forEach((item) => select.add(new Option(item, item)));
          if (state[q.key]) select.value = state[q.key];
          select.addEventListener("change", () => saveAndAdvance(select.value));
          box.append(select);
          options.append(box);
          requestAnimationFrame(() => select.focus({ preventScroll: true }));
          return;
        }

        q.options.forEach((item, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "choice group flex w-full items-center gap-4 rounded-2xl border border-[#e3e4db] bg-white px-4 py-3.5 text-left shadow-[0_5px_16px_rgba(31,47,37,.025)] hover:border-[#a9c79a] hover:bg-[#fbfdf9] sm:px-5";
          const number = document.createElement("span");
          number.className = "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f1f3ed] text-[11px] font-bold text-[#879187] group-hover:bg-[#e8f1e3] group-hover:text-[#477b43]";
          number.textContent = String(index + 1).padStart(2, "0");
          const label = document.createElement("span");
          label.className = "flex-1 text-[13px] font-semibold leading-snug text-[#34433a] sm:text-sm";
          label.textContent = item;
          const arrow = document.createElement("span");
          arrow.className = "text-lg text-[#a2aaa0] group-hover:text-[#56874d]";
          arrow.textContent = "›";
          button.append(number, label, arrow);
          button.addEventListener("click", () => saveAndAdvance(item));
          options.append(button);
        });
      }

      function saveAndAdvance(answer) {
        state[questions[current].key] = answer;
        if (current === questions.length - 1) showSummary();
        else { current += 1; render(); }
      }

      function showSummary() {
        $("flow").classList.add("hidden");
        $("summary").classList.remove("hidden");
        const card = $("summary-card");
        card.replaceChildren();
        const rows = [["Learning language", language()], ...Object.entries(labels).map(([key, label]) => [label, state[key] || "—"])];
        rows.forEach(([label, value], index) => {
          const row = document.createElement("div");
          row.className = "flex items-start justify-between gap-5 px-5 py-4 " + (index === 0 ? "bg-[#f8faf5] " : "") + (index < rows.length - 1 ? "border-b border-[#edf0e8]" : "");
          const name = document.createElement("span");
          name.className = "shrink-0 pt-0.5 text-xs font-medium text-[#89938b]";
          name.textContent = label;
          const answer = document.createElement("strong");
          answer.className = "max-w-[68%] text-right text-[13px] font-semibold leading-snug text-[#2e3d34]";
          answer.textContent = value;
          row.append(name, answer);
          card.append(row);
        });
      }

      $("learning-language").addEventListener("change", () => { if (current === 0) render(); });
      $("back").addEventListener("click", () => { if (current > 0) { current -= 1; render(); } });
      $("restart").addEventListener("click", () => {
        Object.keys(state).forEach((key) => delete state[key]);
        current = 0;
        $("summary").classList.add("hidden");
        $("flow").classList.remove("hidden");
        render();
      });
      render();
    })();
