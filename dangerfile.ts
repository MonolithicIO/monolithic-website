import { danger, fail, warn, message } from "danger";

// Get the PR description
const prDescription = danger.github.pr.body || "";

// Regular expressions to match the Overview section
const overviewHeaderRegex = /##?\s*Overview/i;
const hasOverviewSection = overviewHeaderRegex.test(prDescription);

if (!hasOverviewSection) {
  fail('❌ PR description is missing an "Overview" section. Please add one to explain the changes.');
} else {
  // Extract content after the Overview header
  const overviewMatch = prDescription.match(/##?\s*Overview\s*\n+([\s\S]*?)(?=\n##|\n---|\n\*\*|$)/i);

  if (overviewMatch) {
    const overviewContent = overviewMatch[1].trim();

    // Check if the overview section has meaningful content
    // (more than just whitespace or placeholder text)
    const hasContent =
      overviewContent.length > 10 &&
      !overviewContent.toLowerCase().includes("todo") &&
      !overviewContent.toLowerCase().includes("fill this");

    if (!hasContent) {
      fail(
        "❌ The Overview section exists but appears to be empty or incomplete. Please add a description of your changes."
      );
    } else {
      message("✅ Overview section found with content.");
    }
  } else {
    // Overview header exists but couldn't parse content after it
    warn("⚠️ Overview section found but content could not be parsed. Please ensure it has a proper description.");
  }
}

// Optional: Remind about PR description best practices
if (prDescription.length < 50) {
  warn("⚠️ The PR description seems quite short. Consider adding more context about the changes.");
}
