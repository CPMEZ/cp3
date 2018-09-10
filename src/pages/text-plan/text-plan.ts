import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';

import { PersonalPlansProvider } from '../../providers/personal-plans/personal-plans';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-text-plan',
  templateUrl: 'text-plan.html',
})
export class TextPlanPage {
  plan: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public PPP: PersonalPlansProvider,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private em: EmailComposer) {
    this.plan = navParams.get('plan');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TextPlanPage');
  }

  discList(int: any): string {
    let discText: string = "";
    if (int.interdisciplinary) { discText += "Interdisciplinary, " }
    if (int.nursing) { discText += "Nursing, " }
    if (int.aide) { discText += "Aide, " }
    if (int.bereavement) { discText += "Bereavement, " }
    if (int.dietary) { discText += "Dietary, " }
    if (int.music) { discText += "Music/Other, " }
    if (int.OT) { discText += "OT, " }
    if (int.PT) { discText += "PT, " }
    if (int.pharmacist) { discText += "Pharmacist, " }
    if (int.social) { discText += "Social Work, " }
    if (int.spiritual) { discText += "Spiritual Counselor, " }
    if (int.speech) { discText += "Speech, " }
    if (int.volunteer) { discText += "Volunteer, " }
    if (int.other) { discText += int.other }
    // strip off trailing ", " if any
    discText = discText.trim();
    const lastChar = discText.substr(-1, 1);
    if (lastChar == ",") {
      discText = discText.substr(0, discText.length - 1);
    }
    return discText;
  }

  pdfObj = null;

  createPdf(download: boolean) {
    console.log('pdf');
    var docDefinition = {
      content: [
        { text: "Care Plan: " + this.plan.name, style: "header" },
        { text: "Created:  " + this.plan.created + "     Updated:  " + this.plan.updated, alignment: "right"},
        { text: this.plan.text, style: "subheader" }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          margin: [0, 15, 0, 0]
        },
        date: {
          fontSize: 12,
          alignment: 'right'
        },
        probText: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        goalText: {
          fontSize: 14,
          italics: true,
          margin: [10, 10, 0, 0]
        },
        intText: {
          fontSize: 14,
          margin: [20, 8, 0, 0]
        },
        discText: {
          fontSize: 12,
          margin: [25, 4, 0, 0]
        },
        ital: {
          italics: true
        }
      }
    }

    // add in the problems/goals/interventions as paragraphs in content[]
    if (this.plan.problems) {
      for (let i = 0; i < this.plan.problems.length; i++) {
        // console.log(i, this.plan.problems[i].text)
        // const para: any = { text: "", style: "ptext" };
        // para.text = this.plan.problems[i].text;
        docDefinition.content.push({
          text: this.plan.problems[i].text,
          style: "probText"
        });
        if (this.plan.problems[i].goals) {
          for (let j = 0; j < this.plan.problems[i].goals.length; j++) {
            docDefinition.content.push({
              text: // this.plan.problems[i].goals[j].term +
              "Outcome:  " +
              this.plan.problems[i].goals[j].text, style: "goalText"
            });
          }
        }
        if (this.plan.problems[i].interventions) {
          for (let k = 0; k < this.plan.problems[i].interventions.length; k++) {
            docDefinition.content.push({
              text: // "Intervention:  " + 
              this.plan.problems[i].interventions[k].text,
              style: "intText"
            });
            docDefinition.content.push({
              text: "(" + this.discList(this.plan.problems[i].interventions[k]) + ")",
              style: "discText"
            });
          }
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    if (download) { this.downloadPdf(); }
  }
  // WORKING HERE
  downloadPdf() {
    // if (this.plt.is('ios') || this.plt.is('android')) {
      console.log('download');
    if (this.plt.is('mobile')) {
      // console.log(this.pdfObj);
      // console.log(JSON.stringify(this.pdfObj));
      // const flnm = 'Desc.pdf';
      // const dd = 'file:///Android/data/io.ionic.devapp/';
      // const dd = 'file:///Android/data/io.ionic.devapp/files/';
      // const dd = this.file.externalDataDirectory;
      // console.log('sure:', dd);
      // // this.file.checkDir(dd, 'Test')
      // this.file.checkFile(dd, flnm)
      // // this.file.readAsText(this.file.externalDataDirectory, flnm)
      // // this.file.readAsText(dd, flnm)
      // // this.fileOpener.open(this.file.externalDataDirectory + flnm, 'application/pdf')
      //   .then(() => console.log('hooray'))
      //   .catch(e => console.log('error', JSON.stringify(e)));
      var dd: string;
      if (this.plt.is('ios')) {
        dd = this.file.documentsDirectory;  // verify we can see these docs
      } else if (this.plt.is('android')) {
        dd = this.file.externalDataDirectory;
      }
      console.log('sure:', dd);
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directory of our App
        const flnm = this.formatFileName(this.plan.name) + '_CP.pdf';
        console.log(flnm);
        this.file.writeFile(dd, flnm, blob, { replace: true }).then(fileEntry => {
          console.log('written');
          console.log(dd);
          console.log(flnm);
          // Open the pdf (not supported on DevApp)
          // this.plt.ready().then(() => {
            console.log('in plt.ready');
            this.fileOpener.open(dd + flnm, 'application/pdf')
              .then( () => console.log('hooray'))
              .catch(e => console.log('error', JSON.stringify(e)));
          // })
        })
      });
    } else if (this.plt.is('core')){
      // on browser
      this.pdfObj.download();
    }
  }

  formatFileName(f: string): string {
    // special characters
    // return f.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
    // keep numbers and letters only
    return f.replace(/[^a-zA-Z0-9]/g, '_');
  }
  

  sendEmail() {
    // console.log(this.getPlanText());
    console.log(this.plt.platforms());
    // alert(this.plt.platforms());
    if (this.plt.is('mobile')) {  // no email if not on device
      console.log('mobile');
      this.em.isAvailable().then((hasAccount) => {
        console.log('hasAccount', hasAccount);
        // if (hasAccount) {
          // this.em.hasPermission().then((granted: boolean) => {
          //   console.log('granted', granted);
          //   if (granted) {
              this.createMail();
          //   } else {
          //     this.em.requestPermission().then((granted: boolean) => {
          //       if (granted) {
          //         this.createMail();
          //       } else {
          //         alert('You have not permitted Red Book to email from your device.');
          //       }
          //     });
          //   }
          // });          
        // } else {
        //   alert("Email is not available.  Use 'PDF' and attach the file to email.");
        // }
      });      
    } else {
      alert("If using a browser, automatic email is not available.  Use 'PDF' and attach the file to email.");
    }
  }
  
  createMail() {
    console.log('create');
    this.em.open({
      to: '',
      subject: "Care Plan " + this.plan.name,
      body: this.getPlanText(),
      isHtml: false
    });
  }
  
  getPlanText(): string {
    console.log('getPlanText');
    var text: string = "Care Plan:  " + this.plan.name + "\r\n";
    text += "Created:  " + this.plan.created + "     Updated:  " + this.plan.updated + "\r\n";
    text += "    " + this.plan.text + "\r\n";
    if (this.plan.problems) {
      // console.log('# problems:',this.plan.problems.length);
      for (let i = 0; i < this.plan.problems.length; i++) {
        text+= this.plan.problems[i].text + "\r\n";
        if (this.plan.problems[i].goals) {
          // console.log('# goals:',this.plan.problems[i].goals.length);
          // text+="   Outcomes";
          for (let j = 0; j < this.plan.problems[i].goals.length; j++) {
            text += "    ";
            if (this.plan.problems[i].goals[j].term) { text += this.plan.problems[i].goals[j].term; }
            text += " Outcome:  " +
              this.plan.problems[i].goals[j].text + "\r\n";
          }
        }
        if (this.plan.problems[i].interventions) {
          // console.log('# interventions:', this.plan.problems[i].interventions.length);
          // text += "   Interventions";
          for (let k = 0; k < this.plan.problems[i].interventions.length; k++) {
            text += "    " + 
            this.plan.problems[i].interventions[k].text + "\r\n";
            text += "        " + 
              "(" + this.discList(this.plan.problems[i].interventions[k]) + ")" + "\r\n";
          }
        }
      }
    }
    return text;
  }

}
