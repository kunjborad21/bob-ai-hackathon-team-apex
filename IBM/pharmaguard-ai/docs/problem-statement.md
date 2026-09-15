# Problem Statement

## Background

Post-market pharmacovigilance is a regulatory obligation for all licensed medicines. Once a drug enters the market, manufacturers and regulators must continuously monitor spontaneous adverse-event (AE) reports submitted to national pharmacovigilance databases (e.g., FDA FAERS, EudraVigilance, VigiBase). The volume of these reports grows every year — the FDA alone receives millions of reports annually.

## The Core Problems

### Problem 1 — Signal Detection Is Manual and Slow

Detecting a statistically significant drug-safety signal requires calculating disproportionality statistics (such as Proportional Reporting Ratio, Reporting Odds Ratio, or Information Component) across every drug-event pair in a database. For a database with thousands of drugs and hundreds of event terms, this produces millions of candidate pairs.

Current pain points:
- Analysts manually filter, sort, and triage large result tables.
- There is no automatic clustering of related adverse events to help see patterns.
- Explaining *why* a signal meets the threshold — in plain language suitable for regulatory review — requires manual write-up.
- Context switching between signal-detection tools and reporting tools is time-consuming.

### Problem 2 — CTD Submission Readiness Has No Automated Validator

A Common Technical Document (CTD) submitted for market authorisation must conform to the ICH M4 guideline, which specifies 5 modules containing 74 required sections. Before submitting, regulatory-affairs teams must manually verify that every required section is present and complete.

Current pain points:
- There is no standard automated tool to validate completeness against the full ICH M4 section tree.
- Missing sections are often discovered late in the submission timeline, causing costly delays.
- Severity prioritisation (which gaps are critical vs. minor) is not consistent across teams.
- Teams receive no automated recommendations for how to address gaps.

## Scope of This Prototype

PharmaGuard AI targets these two problems with a working full-stack prototype using 500 synthetic adverse-event reports and a synthetic ICH M4 CTD dossier. All data is synthetic. The prototype demonstrates the algorithmic and UX approaches; it is not intended for production pharmacovigilance or regulatory submissions.

## Target Users

- Pharmacovigilance scientists and safety signal reviewers
- Regulatory-affairs managers responsible for dossier completeness
- Drug-safety teams requiring audit-ready signal explanations
