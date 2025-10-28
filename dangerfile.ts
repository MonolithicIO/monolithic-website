import { danger, fail, warn, message } from "danger";

// Get PR title and description
const prTitle = danger.github.pr.title;
const prDescription = danger.github.pr.body || "";

// ============================================
// 1. CHECK PR TITLE FORMAT
// ============================================
const titlePrefixRegex = /^(FEAT|FIX|CHORE|CI|DOCS):\s+.+/i;

if (!titlePrefixRegex.test(prTitle)) {
  fail('❌ PR title must start with one of: FEAT, FIX, CHORE, CI, or DOCS. Example: "FEAT: Add new feature"');
} else {
  message("✅ PR title format is correct.");
}

// ============================================
// 2. HELPER FUNCTIONS
// ============================================
function getSectionContent(sectionName: string): string | null {
  const regex = new RegExp(`##?\\s*${sectionName}\\s*\\n+([\\s\\S]*?)(?=\\n##|\\n---|$)`, "i");
  const match = prDescription.match(regex);
  return match ? match[1].trim() : null;
}

function hasSection(sectionName: string): boolean {
  const regex = new RegExp(`##?\\s*${sectionName}`, "i");
  return regex.test(prDescription);
}

function hasContent(content: string | null): boolean {
  if (!content) return false;
  // Check if content has more than 10 chars and isn't just placeholder text
  return (
    content.length > 10 &&
    !content.toLowerCase().includes("todo") &&
    !content.toLowerCase().includes("fill this") &&
    !content.toLowerCase().includes("n/a")
  );
}

// ============================================
// 3. CHECK OVERVIEW SECTION (Required with content)
// ============================================
if (!hasSection("Overview")) {
  fail('❌ PR description is missing an "Overview" section. Please add one to explain the changes.');
} else {
  const overviewContent = getSectionContent("Overview");
  if (!hasContent(overviewContent)) {
    fail("❌ The Overview section must contain a meaningful description of your changes.");
  } else {
    message("✅ Overview section found with content.");
  }
}

// ============================================
// 4. CHECK "WHAT CHANGED" SECTION (Required with content)
// ============================================
if (!hasSection("What Changed")) {
  fail('❌ PR description is missing a "What changed" section. Please add one to list the changes made.');
} else {
  const whatChangedContent = getSectionContent("What Changed");
  if (!hasContent(whatChangedContent)) {
    fail('❌ The "What changed" section must contain a description of the changes.');
  } else {
    message('✅ "What changed" section found with content.');
  }
}

// ============================================
// 5. CHECK "UNRELATED CHANGES" SECTION (Required, content optional)
// ============================================
if (!hasSection("Unrelated Changes")) {
  fail('❌ PR description is missing an "Unrelated Changes" section. Please add this section (content is optional).');
} else {
  message('✅ "Unrelated Changes" section found.');
}

// ============================================
// 6. CHECK "HOW TO TEST" SECTION (Required, content optional)
// ============================================
if (!hasSection("How to Test")) {
  fail('❌ PR description is missing a "How to Test" section. Please add this section (content is optional).');
} else {
  message('✅ "How to Test" section found.');
}

// ============================================
// 7. CHECK "BEST PRACTICES" SECTION WITH CHECKBOXES
// ============================================
const requiredCheckboxes = [
  "I have followed the architectural patterns",
  "I'm aligned with naming conventions and default file structure",
  "I have updated the unit tests to reflect my changes",
];

if (!hasSection("Best Practices")) {
  fail('❌ PR description is missing a "Best practices" section with required checkboxes.');
} else {
  const bestPracticesContent = getSectionContent("Best Practices");

  let allCheckboxesPresent = true;
  let allCheckboxesChecked = true;

  requiredCheckboxes.forEach(checkboxText => {
    // Check for both checked [x] and unchecked [ ] versions
    const checkedRegex = new RegExp(`-?\\s*\\[x\\]\\s*${checkboxText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    const uncheckedRegex = new RegExp(
      `-?\\s*\\[\\s*\\]\\s*${checkboxText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "i"
    );

    const isChecked = bestPracticesContent ? checkedRegex.test(bestPracticesContent) : false;
    const isPresent = bestPracticesContent
      ? checkedRegex.test(bestPracticesContent) || uncheckedRegex.test(bestPracticesContent)
      : false;

    if (!isPresent) {
      allCheckboxesPresent = false;
      fail(`❌ Missing checkbox in Best practices: "${checkboxText}"`);
    } else if (!isChecked) {
      allCheckboxesChecked = false;
      warn(`⚠️ Unchecked checkbox in Best practices: "${checkboxText}"`);
    }
  });

  if (allCheckboxesPresent && allCheckboxesChecked) {
    message("✅ All Best practices checkboxes are present and checked.");
  } else if (allCheckboxesPresent) {
    message("✅ All Best practices checkboxes are present.");
  }
}

// ============================================
// 8. SUMMARY
// ============================================
const prDescriptionLength = prDescription.length;
if (prDescriptionLength < 100) {
  warn("⚠️ The PR description seems quite short. Consider adding more context.");
}
