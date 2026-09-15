# Problem Statement

## Background

Pharmaceutical companies need to monitor adverse-event reports to identify potential drug-safety signals and prepare regulatory submissions according to structured requirements such as the ICH Common Technical Document (CTD).

These activities involve reviewing large amounts of information and checking many regulatory sections. Safety signal analysis and submission-readiness checking are often handled as separate activities, which can make the overall review process more difficult and time-consuming.

## The Problem

Pharmacovigilance teams need to identify potentially important drug-event associations from adverse-event data, while regulatory teams need to determine whether a CTD dossier contains the required sections and identify documentation gaps.

Manual review can make it difficult to quickly:

* Detect statistically significant drug-event patterns.
* Rank potentially important safety signals.
* Understand why a particular signal was detected.
* Identify missing or incomplete CTD sections.
* Prioritize important submission gaps.

A unified workflow that combines these capabilities can make the analysis easier to explore and review.

## Who is Affected

The problem primarily affects:

* **Pharmacovigilance teams** analyzing adverse-event reports.
* **Regulatory-affairs teams** preparing pharmaceutical submissions.
* **Drug-safety analysts** investigating potential safety signals.
* **Regulatory reviewers** checking dossier completeness before submission.

## Why It Matters

Drug-safety analysis is important because potential safety patterns need to be identified and investigated carefully.

Incomplete regulatory documentation can also create additional review work and may require teams to spend more time finding and addressing missing information.

For this reason, a tool that brings signal detection, explainability, and submission-readiness checking into one workflow can help teams understand potential issues earlier and organize their review more effectively.

PharmaGuard AI demonstrates this concept using **500 synthetic adverse-event reports across 6 drugs** and a **synthetic ICH M4 CTD dossier**.

## Why Existing Solutions Fall Short

Traditional workflows may require analysts to use separate processes for adverse-event analysis and regulatory-document checking.

Safety analysis can involve statistical calculations, clustering, ranking, and investigation of individual drug-event pairs. Regulatory preparation requires a different type of structured completeness review across CTD modules.

These activities are not necessarily connected in a single workflow.

PharmaGuard AI addresses this gap by combining:

* PRR-based drug-safety signal detection.
* Signal clustering and ranking.
* Per-signal explainability.
* ICH M4 CTD completeness checking.
* Gap severity reporting.
* AI-assisted recommendations.

The project is a hackathon prototype using synthetic data and is **not intended for clinical, diagnostic, or real regulatory decision-making**.
