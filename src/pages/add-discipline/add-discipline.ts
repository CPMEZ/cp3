import { Component } from '@angular/core';
import { Toast } from '@ionic-native/toast';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { MasterPlansProvider } from '../../providers/master-plans/master-plans';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LookupPage } from '../lookup/lookup';
import { HelpPage } from '../help/help';
import { LoginPage } from '../login/login';
import { PreviewPage } from '../preview/preview';
// import { ArrayType } from '@angular/compiler/src/output/output_ast';

@IonicPage()
@Component({
  selector: 'page-add-discipline',
  templateUrl: 'add-discipline.html',
})
export class AddDisciplinePage {
  planPreview: any;
  plan: any;
  discipline: {} = {};
  // problem: {} = {};
  // problems: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private plt: Platform,
    private toast: Toast,
    public PPP: PersonalPlansProvider,
    public MPP: MasterPlansProvider,
    public auth: AuthenticationProvider) {
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDisciplinePage');
  }

  ionViewDidEnter() {
    // may have come from add, may have returned from selection
    console.log('ionViewDidEnter AddDisciplinePage');
    // this.discipline["text"] = "";
    if (this.MPP.listSelection) {
      console.log('got listSelection');
      this.discipline = this.MPP.listSelection;
      console.log(this.discipline);
      // clear it immediately after used
      this.MPP.listSelection = "";
    }
    if (this.MPP.previewSelection) {
      console.log('got previewSelection');
      this.discipline = this.MPP.previewSelection;
      console.log(this.discipline);
      // clear it immediately after used
      this.MPP.previewSelection = undefined;
    }
  }

  lookupMaster() {
    this.navCtrl.push(LookupPage, {
      types: "disciplines",
      type: "discipline",
      searchName: "Discipline",
      planName: this.plan.name,      
      item: this.discipline
    });
  }

  populateProblemsWOPreview() {
    // get the list of problems associated with a discipline,
    // add the list to the plan
    this.MPP.getMaster(this.discipline["file"])
      .then(data => {
        const cond: {} = JSON.parse(data);
        if (this.plan.problems.length > 0) {  // some problems already, therefore merge
          this.mergeProblems(cond);
        } else {  // no problems at all yet, just add from selected discipline
          this.addProblems(cond);
        }
        this.PPP.write();
      });
  }

  populateProblemsFromPreview(p) {
    console.log('populateProblemsFromPreview');
    // p is the content returned from preview
    // use the content returned from preview
    // add to the plan
    if (this.plan.problems.length > 0) {  // some problems already, therefore merge
      this.mergeProblems(p);
    } else {  // no problems at all yet, just add from selected discipline
      this.addProblems(p);
    }
    this.PPP.write();
  }



  preview() {
    // get discipline contents to preview
    this.MPP.getMaster(this.discipline["file"])
      .then(data => {
        this.planPreview = JSON.parse(data);
        console.log(this.planPreview);
        this.navCtrl.push(PreviewPage, {
          plan: this.planPreview.discipline,
          type: "Discipline"
        });
      });

  }

  addProblems(cond) {
    console.log('addProblems');
    cond["discipline"]["problems"].forEach(p => {
      p["icon"] = "arrow-dropdown";
      p["expanded"] = true;
      this.plan.problems.push(p);
    });
  }

  mergeProblems(cond) {
    console.log('mergeProblems');
    if (this.plan.problems.length > 0) {
      // if the plan is not currently empty, 
      // merge into existing problems
      cond["discipline"]["problems"].forEach(p => {
        let found = false;
        for (var i = 0; i < this.plan.problems.length; i++) {
          // problem in newly-added discipline already in the plan?
          if (this.plan.problems[i].text === p["text"]) {
            found = true;
            // these lines will cause problem to which we've added to be expanded
            p["icon"] = "arrow-dropdown";
            p["expanded"] = true;
            // add the goals and interventions to the existing problem
            console.log("goals");
            if (p.hasOwnProperty("goals")) {
              if (this.plan.problems[i].hasOwnProperty("goals")) {  // existing has goals already
                this.addNewItems(p["goals"], "text", this.plan.problems[i].goals);
              } else { // no goals on existing problem, create "goals" & add
                this.plan.problems[i]["goals"] = p["goals"];
              }
            }
            console.log("interventions");
            if (p.hasOwnProperty("interventions")) {
              if (this.plan.problems[i].hasOwnProperty("interventions")) {  // existing has interventions already
                this.addNewItems(p["interventions"], "text", this.plan.problems[i].interventions);
              } else { // no interventions on existing problem, create "interventions" & add
                this.plan.problems[i]["interventions"] = p["interventions"];
              }
            }
            break;  // no need to look further
          }
        }
        if (!found) {  // never found it, add the whole problem
          p["icon"] = "arrow-dropdown";
          p["expanded"] = true;
          this.plan.problems.push(p);
        }
      })
    }
  }

  addNewItems(source: Array<object>, element: string, arr: Array<object>) {
    // only insert items not already found
    var work = source;
    var found;
    for (var i = 0; i < arr.length; i++) {
      found = undefined;
      for (var j = 0; j < work.length; j++) {
        if (work[j][element] == arr[i][element]) {
          found = j;
        }
      }
      if (found < work.length) {
        // remove from working array
        work.splice(found, 1);
      }
    };
    // now add the remaining
    if (work.length > 0) {
      for (var k = 0; k < work.length; k++) {
        arr.push(work[k]);
      }
    }
  }

  editDone() {
    const d: Date = new Date();
    this.plan.updated = d.toLocaleDateString();
    if (this.discipline) this.populateProblemsWOPreview();
    if (this.plt.is('mobile')) {
      this.toast.show('Added ' + this.discipline["text"], '1500', 'center').subscribe(t => { });
    }
    this.navCtrl.pop();
  }
  cancelEdit() {
    // exit w/o save
    this.navCtrl.pop();
  }

  help() {
    this.navCtrl.push(HelpPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }
  logout() {
    // confirm before logout
    let prompt = this.alertCtrl.create({
      title: 'Confirm Log Out',
      buttons: [
        {
          text: "No, don't log out",
          role: 'cancel'
        },
        {
          text: 'Yes, log out',
          handler: () => {
            // this.PPP.write();
            this.auth.logout();
          }
        }
      ]
    });
    prompt.present();
  }
}
