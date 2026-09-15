"""
Authoritative ICH M4 CTD Module Structure.
Each entry: section_id -> { name, severity, required }
severity: "Critical" | "Major" | "Minor"
"""

ICH_M4_SCHEMA = {
    "module_1": {
        "name": "Module 1 – Administrative Information and Prescribing Information",
        "sections": {
            "1.1":    {"name": "Comprehensive Table of Contents",               "severity": "Critical"},
            "1.2":    {"name": "Application Form",                              "severity": "Critical"},
            "1.3.1":  {"name": "Summary of Product Characteristics (SmPC)",     "severity": "Critical"},
            "1.3.2":  {"name": "Labelling",                                     "severity": "Critical"},
            "1.4":    {"name": "Information About the Experts",                 "severity": "Major"},
            "1.5":    {"name": "Specific Requirements for Different Types of Applications", "severity": "Major"},
            "1.6":    {"name": "Environmental Risk Assessment",                 "severity": "Major"},
            "1.7":    {"name": "Information Relating to Orphan Market Exclusivity", "severity": "Minor"},
            "1.8":    {"name": "Information Relating to Pharmacovigilance",     "severity": "Critical"},
            "1.9":    {"name": "Information Relating to Clinical Trials",       "severity": "Major"},
            "1.10":   {"name": "Information Relating to Paediatrics",           "severity": "Major"},
            "1.11":   {"name": "Information Relating to Bibliography",          "severity": "Minor"},
            "1.12":   {"name": "Fee-Related Documentation",                     "severity": "Minor"},
        }
    },
    "module_2": {
        "name": "Module 2 – Common Technical Document Summaries",
        "sections": {
            "2.1":    {"name": "CTD Table of Contents",                         "severity": "Critical"},
            "2.2":    {"name": "Introduction",                                  "severity": "Major"},
            "2.3":    {"name": "Quality Overall Summary (QOS)",                 "severity": "Critical"},
            "2.4":    {"name": "Nonclinical Overview",                          "severity": "Critical"},
            "2.5":    {"name": "Clinical Overview",                             "severity": "Critical"},
            "2.6.1":  {"name": "Nonclinical Written Summary – Introduction",    "severity": "Major"},
            "2.6.2":  {"name": "Pharmacology Written Summary",                  "severity": "Major"},
            "2.6.3":  {"name": "Pharmacokinetics Written Summary",              "severity": "Major"},
            "2.6.4":  {"name": "Toxicology Written Summary",                    "severity": "Major"},
            "2.6.5":  {"name": "Pharmacology Tabular Summary",                  "severity": "Minor"},
            "2.6.6":  {"name": "Pharmacokinetics Tabular Summary",              "severity": "Minor"},
            "2.7.1":  {"name": "Clinical Summary – Summary of Biopharmaceutic Studies", "severity": "Major"},
            "2.7.2":  {"name": "Clinical Summary – Summary of Clinical Pharmacology",   "severity": "Critical"},
            "2.7.3":  {"name": "Clinical Summary – Summary of Clinical Efficacy",       "severity": "Critical"},
            "2.7.4":  {"name": "Clinical Summary – Summary of Clinical Safety",         "severity": "Critical"},
            "2.7.5":  {"name": "Clinical Summary – References",                         "severity": "Minor"},
            "2.7.6":  {"name": "Clinical Summary – Synopses of Individual Studies",     "severity": "Major"},
        }
    },
    "module_3": {
        "name": "Module 3 – Quality",
        "sections": {
            "3.1":     {"name": "Table of Contents",                            "severity": "Minor"},
            "3.2.S.1": {"name": "Drug Substance – General Information",         "severity": "Critical"},
            "3.2.S.2": {"name": "Drug Substance – Manufacture",                 "severity": "Critical"},
            "3.2.S.3": {"name": "Drug Substance – Characterisation",            "severity": "Critical"},
            "3.2.S.4": {"name": "Drug Substance – Control of Drug Substance",   "severity": "Critical"},
            "3.2.S.5": {"name": "Drug Substance – Reference Standards",         "severity": "Major"},
            "3.2.S.6": {"name": "Drug Substance – Container Closure System",    "severity": "Major"},
            "3.2.S.7": {"name": "Drug Substance – Stability",                   "severity": "Critical"},
            "3.2.P.1": {"name": "Drug Product – Description and Composition",   "severity": "Critical"},
            "3.2.P.2": {"name": "Drug Product – Pharmaceutical Development",    "severity": "Critical"},
            "3.2.P.3": {"name": "Drug Product – Manufacture",                   "severity": "Critical"},
            "3.2.P.4": {"name": "Drug Product – Control of Excipients",         "severity": "Major"},
            "3.2.P.5": {"name": "Drug Product – Control of Drug Product",       "severity": "Critical"},
            "3.2.P.6": {"name": "Drug Product – Reference Standards",           "severity": "Major"},
            "3.2.P.7": {"name": "Drug Product – Container Closure System",      "severity": "Major"},
            "3.2.P.8": {"name": "Drug Product – Stability",                     "severity": "Critical"},
            "3.2.A.1": {"name": "Appendices – Facilities and Equipment",        "severity": "Minor"},
            "3.2.A.2": {"name": "Appendices – Adventitious Agents Safety",      "severity": "Major"},
            "3.2.A.3": {"name": "Appendices – Excipients",                      "severity": "Minor"},
            "3.3":     {"name": "Literature References",                         "severity": "Minor"},
        }
    },
    "module_4": {
        "name": "Module 4 – Nonclinical Study Reports",
        "sections": {
            "4.1":     {"name": "Table of Contents",                            "severity": "Minor"},
            "4.2.1.1": {"name": "Primary Pharmacodynamics",                     "severity": "Critical"},
            "4.2.1.2": {"name": "Secondary Pharmacodynamics",                   "severity": "Major"},
            "4.2.1.3": {"name": "Safety Pharmacology",                          "severity": "Critical"},
            "4.2.2.1": {"name": "Analytical Methods and Validation Reports – PK", "severity": "Major"},
            "4.2.2.2": {"name": "Absorption",                                   "severity": "Critical"},
            "4.2.2.3": {"name": "Distribution",                                 "severity": "Critical"},
            "4.2.2.4": {"name": "Metabolism",                                   "severity": "Critical"},
            "4.2.3.1": {"name": "Single-Dose Toxicity",                         "severity": "Critical"},
            "4.2.3.2": {"name": "Repeat-Dose Toxicity",                         "severity": "Critical"},
            "4.2.3.3": {"name": "Genotoxicity",                                 "severity": "Critical"},
            "4.2.3.4": {"name": "Carcinogenicity",                              "severity": "Major"},
            "4.2.3.5": {"name": "Reproductive and Developmental Toxicity",      "severity": "Critical"},
            "4.2.3.6": {"name": "Local Tolerance",                              "severity": "Major"},
            "4.2.3.7": {"name": "Other Toxicity Studies",                       "severity": "Minor"},
            "4.3":     {"name": "Literature References",                         "severity": "Minor"},
        }
    },
    "module_5": {
        "name": "Module 5 – Clinical Study Reports",
        "sections": {
            "5.1":     {"name": "Table of Contents",                            "severity": "Minor"},
            "5.2":     {"name": "Tabular Listing of All Clinical Studies",      "severity": "Critical"},
            "5.3.1.1": {"name": "Reports of Biopharmaceutic Studies",           "severity": "Critical"},
            "5.3.1.2": {"name": "Reports of Bioanalytical and Analytical Methods", "severity": "Major"},
            "5.3.2.1": {"name": "PK Studies in Healthy Subjects",               "severity": "Critical"},
            "5.3.2.2": {"name": "PK Studies in Target Population",              "severity": "Critical"},
            "5.3.3.1": {"name": "Intrinsic Factor PK Studies",                  "severity": "Major"},
            "5.3.3.2": {"name": "Extrinsic Factor PK Studies",                  "severity": "Major"},
            "5.3.4":   {"name": "PK/PD Studies",                               "severity": "Major"},
            "5.3.5.1": {"name": "Phase II Dose-Response Studies",               "severity": "Critical"},
            "5.3.5.2": {"name": "Phase III Controlled Efficacy Studies",        "severity": "Critical"},
            "5.3.5.3": {"name": "Uncontrolled Efficacy Studies",                "severity": "Major"},
            "5.3.6":   {"name": "Post-Marketing Experience",                    "severity": "Minor"},
            "5.3.7":   {"name": "Case Report Forms and Individual Patient Listings", "severity": "Minor"},
            "5.4":     {"name": "Literature References",                        "severity": "Minor"},
            "5.3.5.4": {"name": "Other Clinical Studies",                       "severity": "Minor"},
        }
    }
}
