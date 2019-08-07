import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';
import { WelcomePage } from '../welcome/welcome';
import { CarePlanPage } from '../careplan/careplan';

@IonicPage()
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {
  copyOfSource: any;
  target: any;
  type: string;
  fromPage: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public PPP: PersonalPlansProvider) {
      this.target = navParams.get('target');
      this.type = navParams.get('type');
      this.fromPage = navParams.get('fromPage');
    this.copyOfSource = PPP.deepCopy(navParams.get('source'));
      this.addCheckedProperty(this.copyOfSource);
  }

  save() {
    // exit w save
    // reduce the content to only the items checked
    this.getChecked();
    // do the merge
    this.PPP.mergePlans(this.target, this.copyOfSource)
    // now go to page we're called from
    if (this.fromPage === 'plans') {
      // we're adding from the plans page
      // add the target to personal plans
      this.PPP.plans.push(this.target);
      this.PPP.write();
      this.navCtrl.setPages([{ page: WelcomePage }, { page: CarePlanPage }]);
    } else if (this.fromPage === 'contents') {
      // we're adding from the contents page
      this.PPP.write();
      // remove select list from nav stack
      this.navCtrl.removeView(this.navCtrl.getPrevious())
        .then(() => {
          this.navCtrl.pop(); // go back to contents page
        });
    }
  }

  getChecked() {
    // console.log('original before select', this.copyOfSource);
    // copy checked goals & interventions to a new array each
    // replace the p.problems.goals/interventions array when done
    this.copyOfSource["problems"].forEach(p => {
      let gg = [];
      p["goals"].forEach(g => {
        if (g.checked) {
          gg.push(g);
        }
      })
      p["goals"] = gg;
      let nn = [];
      p["interventions"].forEach(n => {
        if (n.checked) {
          nn.push(n);
        }
      })
      p["interventions"] = nn;
    });
    // remove "empty" problems
    let pp = [];
    this.copyOfSource["problems"].forEach(p => {
      if (p["goals"].length > 0
        || p["interventions"].length > 0)
        pp.push(p);
    })
    this.copyOfSource["problems"] = pp;
    // console.log('resulting after select', this.copyOfSource);
  }

  cancelEdit() {
    // exit w/o save
    this.navCtrl.pop(); // go back to previous page
    
    // go back to the page we're called from
    // if (this.fromPage === 'plans') {
    //   this.navCtrl.popToRoot(); // go back to plans page
    // } else if (this.fromPage === 'contents') {
    //   // remove select list from nav stack
    //   this.navCtrl.removeView(this.navCtrl.getPrevious())
    //     .then(() => {
          // this.navCtrl.pop(); // go back to contents page
    //     });
    // }
  }

  addCheckedProperty(p: any) {
    // console.log('addCheckedProperty', p);
    for (let j = 0; j < p["problems"].length; j++) {
      if (p["problems"][j]["goals"]) {
        p["problems"][j]["goals"].forEach(g => {
          g.checked = true;
        });
      } else { // if no goals, create
        p["problems"][j]["goals"] = [];
      }
      if (p["problems"][j]["interventions"]) {
        p["problems"][j]["interventions"].forEach(i => {
          i.checked = true;
        });
      } else { // if no interventions, create
        p["problems"][j]["interventions"] = [];
      }
    }
  }

  selectAll() {
    this.copyOfSource["problems"].forEach(p => {
      p["goals"].forEach(g => {
        g.checked = true;
      });
      p["interventions"].forEach(n => {
        n.checked = true;
      });
    });
  }
  selectNone() {
    this.copyOfSource["problems"].forEach(p => {
      p["goals"].forEach(g => {
        g.checked = false;
      });
      p["interventions"].forEach(n => {
        n.checked = false;
      });
    });
  }

}
