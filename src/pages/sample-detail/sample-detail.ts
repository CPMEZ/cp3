import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sample-detail',
  templateUrl: 'sample-detail.html',
})
export class SampleDetailPage {

  samplePlan =
    {
      problems: [
        {
          text: "General Observation/Assessment",
          goals: [],
          interventions: [
            {
              text: "Assessment of all systems of patient with Alzheimer's admitted for hospice for _____"
            },
            {
              text: "Assessment of the patient with dementia and support/coping skills of family and caregivers"
            }
          ]
        },
        {
          text: "Teaching, Training & Coaching",
          goals: [
            {
              text: "Caregiver/Family will be taught to care for patient as demonstrated by observation/interview regarding _____ by _____"
            },
            {
              text: "Family/Caregiver will be able to list adverse reactions, potential complications, signs/symptoms of infection by _____ "
            },
            {
              text: "Family/Caregiver will be effective in care management and will know whom to call for questions/concerns by _____"
            },
            {
              text: "Family/Caregiver will demonstrate _____% compliance with instructions related to care by _____"
            },
            {
              text: "Family/Caregiver will integrate information and care regarding implications of disease and terminal nature as evidenced by _____ by ____"
            },
            {
              text: "Family/Caregivers will demonstrate information taught, including the role of reassurance and consistency in activities and schedules by _____ "
            },
            {
              text: "Patient will present comfortable; family/caregiver will report no/decreased fear/anxiety/frustration by _____ "
            },
            {
              text: "Patient's daily, consistent routine will be maintained as noted in caregiver log/notes"
            }
          ],
          interventions: [
            {
              text: "Teach family/caregiver current/new/changed pain control measures and medication regimen"
            },
            {
              text: "Teach patient/caregiver/family's about disease process and management"
            }
          ]
        },
        {
          text: "Comfort Care/Symptom Control",
          goals: [
            {
              text: "Death with dignity,  maximum comfort through effective symptom control with specialized hospice support will be maintained in setting of patient/caregiver/family choice"
            }
          ],
          interventions: [
            {
              text: "Assess pain/problems/symptoms, and evaluate the pain/symptom control management's effectiveness"
            },
            {
              text: "Assess and address pain, symptom, and relief measures"
            }
          ]
        },
        {
          text: "Safety & Mobility",
          goals: [
            {
              text: "Teaching program related to the prevention of infection and injuries will be demonstrated by family/caregiver by _____ "
            },
            {
              text: "Family/caregiver will be taught and supported regarding the need for a safe, consistent, and nurturing physical environment by _____ "
            },
            {
              text: "Family/Caregiver will adhere to the plan of care (POC) as evidenced by demonstration and ability of safe and supportive care by ____ "
            }
          ],
          interventions: [
            {
              text: "Teach family/caregiver regarding importance of observation of patient's safety"
            },
            {
              text: "Teach family/caregiver regarding safety of patient in home"
            }
          ]
        },
        {
          text: "Emotional/Spiritual",
          goals: [],
          interventions: [
            {
              text: "Provide spiritual counseling/support to patient/caregiver/family who are verbalizing the reason for or meaning of suffering"
            }
          ]
        },
        {
          text: "Skin Care",
          goals: [
            {
              text: "Support/Maintain optimal skin integrity through care."
            }
          ],
          interventions: [
            {
              text: "Assessment/Observation of skin and patient's physical status"
            },
            {
              text: "Teach family/caregiver regarding patient's skin care needs"
            }
          ]
        },
        {
          text: "Hydration/Nutrition/Elimination",
          goals: [
            {
              text: "Family/Caregiver will verbalize understanding of and adhere to care and medication regimen by _____ "
            },
            {
              text: "Nutritional needs will be maintained/addressed as evidenced by patient's weight maintained/increased by _____ lbs, by _____. (specify date)"
            }
          ],
          interventions: [
            {
              text: "Assess/Implement and monitor bowel regimen, and teach program to family/caregiver"
            },
            {
              text: "Assessment/Observation/Evaluation of bladder elimination habits and management of incontinence, and assess need for indwelling catheter"
            },
            {
              text: "Assess amount and frequency of urinary output"
            },
            {
              text: "Encourage hand held foods to encourage self feeding"
            },
            {
              text: "Assess/Monitor hydration and nutrition status"
            },
            {
              text: "Evaluate for weight loss, weigh patient every visit, and record weight "
            },
            {
              text: "Assess for electrolyte imbalance"
            },
            {
              text: "Diet counseling for patient with anorexia"
            }
          ]
        },
        {
          text: "Therapeutic/Medication",
          goals: [],
          interventions: [
            {
              text: "Assess/Monitor medication management for psychotic behavior and other effects of therapy and/or integrations"
            },
            {
              text: "Assess/Monitor effects of tranquilizers given for severe agitation/anxiety"
            },
            {
              text: "Obtain venipuncture for _____ and monitor lab results as ordered every _____"
            },
            {
              text: "Teach family/caregiver current/new/changed medications and effects"
            }
          ]
        },
        {
          text: "Care Coordination/Discharge",
          goals: [
            {
              text: "Patient will be maintained in home with family/caregiver stating/demonstrating adherence to POC"
            },
            {
              text: "Patient/Caregiver/Family centered hospice care will be provided based on the patient's/family's unique situation and needs throughout hospice care"
            }
          ],
          interventions: []
        },
        {
          text: "Other Considerations",
          goals: [],
          interventions: [
            {
              text: "Assist family/caregiver in setting up patient centered routine and stress the importance of adhering to the routine once established"
            }
          ]
        }
      ]
    }


  constructor() {
  }


}
