import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Printer, PrintOptions } from '@ionic-native/printer';
import { TermsPage } from '../terms/terms';
import { SubselectPage } from '../subselect/subselect';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  canPrint: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public auth: AuthenticationProvider,
    private printer: Printer,
    public plt: Platform) {
      if (plt.is('mobile')) {this.canPrint = true;}
  }

print() {
  console.log('print');
  this.printer.isAvailable().then(() => {}, ()=>{} );

  let options: PrintOptions = {
    name: 'Red Book Care Planning User Guide'
    // grayscale: true
  };
  this.printer.print(this.content, options).then(() => { }, () => { } );
}

  done() {
    this.navCtrl.pop();
  }
  
  terms() {
    this.navCtrl.push(TermsPage);
  }

  subscribe() {
    this.navCtrl.push(SubselectPage);
  }

  content =   "<p class='aside'>If you're in a hurry, you can scroll down to <span class='hilite'>Getting Started</span> and the <span class='hilite'>Quick Guide</span> first.</p><h1>How to use Red Book Care Planning</h1><ul><li>Choose content from Tina Marrelli's Red Book</li><li>Care plans are stored securely in the cloud</li><li>Plan on multiple devices</li><li>Care planning you do while offline is synchronized the next time you connect</li></ul><p>The Red Book library is your assurance of high quality content that is:</p><ul><li>Evidence-based</li><li>US Regulatory Compliant</li><li>Pragmatic, tuned by real-world experience</li></ul><p>The library includes starter templates, baseline plans you can incorporate into your own templates, and tailor toyour patients. These are deliberately extensive to provide alternatives that fit your practice, and to remind ofthings that may be important to your patient. Select the template by condition; it is quick and easy to remove anycontent not applicable to your situation. Then customize.</p><p>Access to the library for writing plans, and access to cloud storage for synching your devices is only available,of course, when you are connected to the internet. Care planning you do offline will be sync'd when you connectagain.</p><p>You use your subscription to select the <span class='hilite'>Add ... from the Red Book</span> buttons from various pages in the app.  These include:</p><ul class='hilite'><li>Add a Standard Plan from the Red Book</li><li>Add a Condition from the Red Book</li><li>Add a Discipline from the Red Book</li><li>Add a Care Topic from the Red Book</li><li>Add an Outcome from the Red Book</li><li>Add an Intervention from the Red Book</li></ul><p>Each button presents a list of the corresponding items from the Red Book, for your incorporation into your customized care plans.</p><h3>How Subscribing Works</h3><p>The subscription is an In-App Purchase.</p><p>When you tap Subscribe, the app will show you the subscription option(s) for your selection.  If you choose <span class='hilite'>Purchase</span>, the subscription purchase is completed through Apple's standard iOS iTunes account purchase process.  Payment for the subscription will be charged to your iTunes account, once you've confirmed.</p><p>When this version of the app was released, the subscription was offered monthly.  The period or length of the subscription may change from time to time.  However, you will keep the subscription terms you originally signed up for, unless you change it yourself.</p><p>The subscription renews automatically for another period, if you don't cancel it.  Your iTunes account will be charegd for renewal within 24 hours of the end of the current period.  The charge for the renewal will be the same as the initial charge, but sometimes special promotions may be in effect.</p><p>When this version of the app was released, the cost was 9.99 USD per month, or the equivalent in your local currency.  Renewals will always be the price you originally signed up for, unless you specifically agree to a change, even if the price may be increased for new subscribers.</p><p>If you've taken advantage of a free trial period, then when you subscribe the remaining portion, if any, of your free trial period is forfeit, and your subscription begins immediately</p><h2 id='without'>Without a Subscription</h2><p>You can use Care Planning without a subscription to the Red Book library. Simply select WORK OFFLINE from thewelcome page. You can still enjoy the thoughtful structure and ease of use, you'll just be providing your owncontent. Even with your own content, creating templates, copying and customizing plans, and using the text or pdfoutput in your documentation (or documentation system) will still save you countless hours, simplify your planning,and improve the quality of your documentation.</p><h1 id='templates'>Create Care Plans faster with templates</h1><p>Templates provide a quick and easy way to include most-used content in your care plans, while enablingindividual patient specificity. The following instructions assume you've subscribed to the Red Book content, butit works nearly the same to re-use your own content.</p><p>To create templates, follow these steps.</p><ul><li>From My Care Plans, choose <span class='hilite'>CREATE A NEW PLAN</span>. We suggest naming your plan something easyto find later, such as 'CHF Template'. You may want to name all your templates so that they appear in the samesection of Care Plans, such as 'Template <em>(condition)</em>.'  You may also add a description.</li><li><span class='hilite'>Add a Standard Care Plan from the Red Book</span> Available for many common diseases orconditions, these standard care plans include suggested topics, outcomes, and interventions, which will be added foryou. Standard Plans generally include all nursing interventions.</li><li>Preview the standard plan. Select All or individually select the outcomes and interventions you prefer.  Scroll to the bottom of the screen to <span class='hilite'>SAVE</span>.</li><li>Once added, the newly-created plan will appear at the end of your My Care Plans list. Tap to open.</li></ul><p>To refine your template, you may extend the initial plan</p><ul>Using the upper left menu <ion-icon name='menu'></ion-icon> :<li>Add an additional condition, if needed.  Use this option to create co-morbid or combined templates.  You can choose <span class='hilite'>Add A Condition</span> to incorporate another Red Book Standard Care Plan.You can also add in one of your own plans, if you've already created one.  Choose 'Add from My Plans.' </li><li>Add a discipline, if needed. If you add a discipline, you have to option to Select All or individually choose outcomes and interventions.</li><li>Add a care topic to the plan if needed. Care topics may be problems, disciplines, or simply carefocus areas. You can select from the Red Book, or define your own.</li></ul><ul>Using the menu <ion-icon name='menu'></ion-icon> to the right of each Care Topic:<li>Add or edit outcomes associated with the topic. If you've selected a condition or discipline fromthe Red Book, you would have selected outcomes and interventions in the preview. You may edit or removethese as needed. Of course you may also create your own outcome statements, or add others from the Red Book library. Leave the blanks provided for specifics (because this will be a template.) Add blanks of your own, as needed.</li><li>Add or edit interventions associated with the care topic. Interventions may also have been selected fromthe Red Book. Again, you may select other interventions from Red Book or create your own. Or remove or editany as you see fit. Leave the blanks here too.</li><li>When your changes are complete and the template plan is satisfactory, you're all done. No need to saveexplicitly, the app will save at intervals as you work.</li></ul><p>To begin planning for an individual patient, copy a template first.</p><ul><li>From My Care Plans, choose <span class='hilite'>CREATE A NEW CARE PLAN</span>.</li><li>On the Add a Care Plan Page, name the new plan. The name can be anything you like, but we suggest using care toobserve patient privacy concerns. [See the <span class='hilite'>Patient Privacy Note</span>.]</li><li>Note the 'Add' and 'Copy' buttons will be disabled if the new name duplicates an old name. The buttons becomeavailable immediately, as you type, if the new name hasn't already been used.</li><li>Choose <span class='hilite'>Copy One of My Plans.</span></li>  <li>  Select the Template you want to use for your patient.  As with conditions and disciplines, you will have the opportunity to preview and select the contents you want before saving.</li><li>You will be returned to the My Care Plans page. You'll need to find the new oneyou just created before proceeding (it will be at the bottom of your list of plans).</li></ul><p> Open the new plan (tap on it's name to open its contents), then add or remove topics, outcomes, or interventionsto meet your individual patient's needs. Fill in the blanks to provide necessary specifics.</p><p>We also suggest you add all your co-morbid conditions for a patient at the same time, because the app will removeany duplication as you merge in additional conditions or disciplines. You're then able to refine your resultingtemplate or plan thereafter.</p><p>To merge in a co-morbid condition, you have two options. You can merge in additional conditions from the Red Book,or you can merge in one of your own care plans. If using your own, typically you would choose a discipline orcondition template you've created.</p><p>To merge in another condition from the Red Book:</p><ul><li>Open the new plan if it's not already open.</li><li>Tap the menu <ion-icon name='menu'></ion-icon> icon </li><li>Choose <span class='hilite'>Add a Condition.</span>  As before, you'll be able to preview and select topics, outcomes, and interventions to be added.</li><li>Proceed with adding, removing or modifying topics, outcomes, or interventions as needed.</li></ul><p>To merge in one of your own Plans:</p><ul><li>Open the new plan if it's not alreaedy open.</li><li>Tap the menu <ion-icon name='menu'></ion-icon> icon </li><li>Choose Add from My Plan</li><li>Select the desired plan from the Select list.</li><li>Choose your preferred contents from the preview. <span class='hilite'>SAVE</span> when ready.</li><li>Proceed with adding, removing or modifying topics, outcomes, or interventions as needed.</li></ul><p>Merging Notes: topics, outcomes, and interventions that are not in the plan are added. Those that arealready in the plan will not be added again.</p><p>The merge compares topics, outcomes, and interventions exactly, letter for letter.  If you've filled in some blanks in an item, thatitem will no longer match a like item exactly, and therefore will present again.  This is a good reason to do all your merging first, and do your individualizing care after.</p><p>When merging in a second condition or additional disciplines, the app will expand the care topic(in the Care Plan page) into which items were merged, as a way of showing you where content was added.</p><p>Consider making multiple templates to apply to the most common conditions you encounter in your practice.</p><p>You may also choose to make co-morbid or multi-condition templates. To do so, simply add the set of topics,outcomes, and interventions that apply to those conditions. For example, you may have a Diabetes-HypertensionTemplate, or a Cancer-Opiod Management Template.</p><h1 id='privacy'>Patient Privacy Note</h1><p>As health care professionals, we expect to maintain utmost confidentiality in treating patients' privateinformation. In most countries, laws protect patient privacy, and many provide for severe penalties for violating thistrust.  Red Book Care Planning strongly recommends you do not identify care plans with individual patient names, or anyother protected health information. We suggest using a mnemonic of some kind instead. As the basic idea behind the app is toenable you to compose plans to be easily inserted into some other documentation or documentation system, we suggest youidentify the plan to the specific patient only in the context of a separate, secure system. While care plans stored inthe cloud are encrypted and secure, we nonetheless feel minimizing exposure is the best approach.</p><h1 id='quick'>Quick Guide</h1><h1 id='more'>On Every Page</h1><p>A heading at the top of the page tells you which page you’re on. </p><p>Back option: Most pages will have a Back option, an arrow pointing to the left, at the left side of theheading.  Use this to return to the previous page. On pages where you're adding or editing, 'back' will work just like'cancel'.</p><p>LogIn: Most pages will have an unlock <ion-icon name='unlock'></ion-icon> icon with which you can log in to your Red Book subscription.  If you're currently logged in, the icon will be a lock<ion-icon name='lock'></ion-icon> instead, which you can use to log out (which you rarely need to do).</p><p>Help: Most pages will have a help, '?' <ion-icon name='help'></ion-icon> icon with which you can reach this help page. Of course you already knew that,or you wouldn’t be here.</p><h1>The Welcome Page</h1><p>This is the page you see first when the app starts. Depending on how you last used Care Plans, you willsee different options, described below.</p><h2 id='start'>Getting Started</h2><p>If this is your very first time using the app, you will use <span class='hilite'>WORK OFFLINE</span> to getstarted. Once you've entered the app, you'll be able to subscribe to Red Book content with an In-App Purchase.</p><p>On your first visit, your <span class='hilite'>My Care Plans</span> page will be empty, nearly blank. This isnormal; this is the page where all your plans are listed, and of course you don't have any yet! You'll start with thebig red <span class='hilite'>CREATE A NEW PLAN</span> button. See how to create a plan below.</p><h2>If you've been here before</h2><p><span class='hilite'>LOGIN</span> or <span class='hilite'>WORK OFFLINE</span> to enter the app. Log in toenable access to the Red Book care plan content. Work Offline to work only with your own content.  You may also see <span class='hilite'>WELCOME BACK</span> if you were logged in when you left last time.</p><p>If you were signed in when you last used the app, you may see <span class='hilite'>WELCOME BACK, YOU'RELOGGED IN</span>, and a <span class='hilite'>CONTINUE</span> option.Tap to continue. </p><p>If you were off line when you last used the app, and you have an active internet connection you'll havethe option to <span class='hilite'>LOGIN</span> to sign into your Red Book Care Plans library subscription.</p><p>If you were off line when last used, you are off line now, or you have never subscribed, or if you simplyprefer to, you may also select <span class='hilite'>WORK OFFLINE</span> to continue without using the library.</p><p>If you'd like to subscribe, choose the <span class='hilite'>LOGIN</span> option. You'll have anopportunity to subscribe from the login page. Or just tap this:</p><button ion-button (click)='subscribe()'>Subscribe Now</button><br><h2>The Login Page</h2><p>Reach this page from <span class='hilite'>LOGIN</span> on the Welcome page, or from the menu. You may wantto sign in from the menu if you've been offline.</p><p>No surprises, enter your user ID and password, select <span class='hilite'>LOGIN</span>. Log In will onlybe available if you're connected to the internet. If you're not already subscribed, or if your subscription has expired,you will have the option to <span class='hilite'>SUBSCRIBE</span>.You may select <span class='hilite'>WORK OFFLINE</span> to continue without signing in.</p><h2>My Care Plans Page</h2><p>This is your home page. You got here because you</p><ul><li>were <span class='hilite'>WELCOMED BACK</span>, or</li><li>successfully signed in on the Login page, or</li><li>selected <span class='hilite'>WORK OFFLINE</span> on the Welcome page, or</li><li>selected <span class='hilite'>WORK OFFLINE</span> on the Login page.</li></ul><p>On this page, all your care plans are listed. You will normally start out with an empty list, beforeyou create your first plan. Listed plans may be templates you've created to be copied (see above,) or plans you'vewritten for individual patients (see <a href='#privacy'>Patient Privacy</a> note and <span (click)='terms()'>terms and conditions</span>.)</p><p>There's a big red <span class='hilite'>CREATE A NEW PLAN</span> button at the top of the page. Selectthat button to create a new plan, whether you intend to make a template or an individual patient's plan.</p><p>Each plan listed on the page is identified by the name you gave when you created it. Following thename, thereis anicon<ion-icon name='create' class='tool'></ion-icon>. Tap anywhere on the name or<ion-icon name='create' class='tool'></ion-icon>, to work with the Care Plan, including changing itsname,copying it,deleting it, adding or changing contents, or sharing the plan.</p><p>At the right of the title bar, you may also see upload <ion-icon name='cloud-upload' class='hilite'></ion-icon>and download <ion-icon name='cloud-download' class='hilite'></ion-icon> icons. These will appear if you are logged in.These are to force an upload of your device's current version of your care plans, or to force adownload of the current cloud version.  Usually, these are not needed, as the app takes care of syncing to the cloud as you use it.</p><p>However, sometimes it's helpful for you to control exactly when the sync is done. For example, these may be used to quickly move your plans if you've made changes in one device and need it onanother, that is, you may upload from the device with the changes, and download to the device that needs them.  You may alsoneed to download if someone else has signed into their Red Book subscription on the device you're using, and you need to restore your own plans to the device from the cloud.</p><p>Note all the plans you have created are downloaded or uploaded together, so you don't want to have thelatest of one plan on one device, and the latest of another plan on a different device.</p><h2>(specific) Care Plan Page</h2><p>Where all the work happens. The plan you selected on Care Plans Page is shown. The name of the planappears at the top. To the left of the plan name is a menu  <ion-icon name='menu'></ion-icon> icon.</p><p><ion-icon class='hilite' name='book'></ion-icon>Add a Condition, only if you are logged in to your Red Book subscription.</p><p><ion-icon class='hilite' name='book'></ion-icon>Add a Discipline, only if you are logged in to your Red Book subscription.</p><p><ion-icon name='shuffle'></ion-icon> Add from My Plan, used to merge one of your other plans into this plan.</p><p><ion-icon name='add'></ion-icon>Add Care Topic</p><p><ion-icon name='share'></ion-icon>Share, opens the Text Care Plan Page, from which you may clipboard, email, or make a PDF of your plan.</p><p><ion-icon name='trash'></ion-icon>Delete, after confirmation, will remove the care plan permanently.</p><p>Below the name, care topics are listed in Red. These topics may be aspects of care, physiology, disciplines,or otherfocus areas. This area will be blank initially, as you are creating a new plan. Each care topic has an option on the left to expand <ion-icon name='arrow-dropright'></ion-icon> or collapse <ion-icon name='arrow-dropdown'></ion-icon> its content, to enable easier navigation. The topics arelisted in the order they were added to the plan.</p><p>On the right of each Topic is a menu <ion-icon name='menu'></ion-icon> option to:</p><ul><li><ion-icon name='star'></ion-icon> Add an Outcome</li><li><ion-icon name='construct'></ion-icon> Add an Intervention</li><li><ion-icon name='trash'></ion-icon> Delete this Topic</li></ul><p>When expanded, outcomes and interventions related to the care topic are listed. Outcomes are listedfirst in Green, followed by interventions in Blue.</p><p>Both outcomes and interventions are listed in the order originally entered. You can drag and drop torearrange outcomes or interventions within their topics, and within that screen view.  (That is, the screen won't scroll while dragging.) </p><p>Outcomes may indicate short or long term with “ST” or “LT” preceding the outcome text. Interventions may indicate the applicable discipline(s),listed after the intervention text.</p><p>Each has a Delete <ion-icon name='trash'></ion-icon> option to the right of the item.</p><h1>How To</h1><h2>To create a new plan: </h2><p>on My Care Plans page, tap the big red <span class='hilite'>CREATE A NEW PLAN</span>.</p><p>Name the new plan. Description is optional.</p><p>You can create a plan four ways:</p><ol><li><span class='hilite'>Add Care Plan</span> creates an 'empty' plan.</li><li><span class='hilite'>Add Guided Care Plan</span> creates a plan with suggested Topics only.</li><li><span class='hilite'>Add a Standard Care Plan</span> available only if you're subscribed and logged in to the Red Book.</li><li><span class='hilite'>Copy One of My Plans</span> creates a new plan as a copy; useful for templates.</li></ol><p>After completing create, you will return to the My Care Plans page.</p><h2>To add content to a care plan:</h2><p>On My Care Plans page, tap the care plan name.</p><p>On Care Plan page (the name of the plan is shown at the top), select the menu <ion-icon name='menu'></ion-icon> to the left of the name, and</p><p>tap <span class='hilite'><ion-icon name='book'></ion-icon> Add a Condition</span> (available if you are logged in), OR</p><p>tap <span class='hilite'><ion-icon name='book'></ion-icon> Add a Discipline</span> (available if you are logged in), OR</p><p>tap <ion-icon name='shuffle'></ion-icon>Add from My Plan, OR</p><p>tap <ion-icon name='add'></ion-icon>Add a Care Topic</p><h3>Add your own topic (problem, category, or focus area):</h3><p>On Care Plan page, select the left menu <ion-icon name='menu'></ion-icon> and tap <ion-icon name='add'></ion-icon>Add a Care Topic</p><p>On the Add A Care Topic page, type the topic name and save. Description is optional.</p><h3>Add a topic from the Red Book:</h3><p>Make sure you’re on line and logged in. Verify the lock <ion-icon name='lock'></ion-icon> in the page heading.</p><p>On Care Plan page, select the left menu <ion-icon name='menu'></ion-icon> and tap <ion-icon name='add'></ion-icon>Add a Care Topic</p><p>On the Add A Care Topic page,</p><p>Tap <span class='hilite'>ADD FROM THE RED BOOK</span> button.</p><p>Optionally, search for a topic.</p><p>Tap your selected topic in the list.</p><p>You will return to the Add Care Topic page.</p><p>Change the text of the topic as you wish.</p><p>Tap <span class='hilite'>SAVE</span>.</p><h2>To add an outcome:</h2><h3>Add your own:</h3><p>On Care Plan page, select the menu <ion-icon name='menu'></ion-icon> to the right of the Topic to which you want to add.</p>      <p>Tap <ion-icon name='star'></ion-icon>Add an Outcome</p>      <p>On the Add an Outcome page, enter the outcome description.</p><p>Short Term/Long Term is optional.</p><p>Tap <span class='hilite'>SAVE</span>.</p><h3>Add from the Red Book:</h3><p>Make sure you’re on line and logged in. Verify the<ion-icon name='lock'></ion-icon> in the page heading.</p><p>On Care Plan page, select the menu <ion-icon name='menu'></ion-icon> to the right of the Topic to which you want to add.</p>      <p>Tap <ion-icon name='star'></ion-icon>Add an Outcome</p>  <p>On the Add an Outcome page,</p><p>Tap <span class='hilite'>ADD FROM THE RED BOOK</span> button.</p><p>Optionally, search for an outcome.</p><p>Tap your selected outcome in the list.</p><p>You will return to the Add an Outcome page.</p><p>Change the text of the outcome as you wish, filling in blanks as needed.</p><p>Tap <span class='hilite'>SAVE</span>.</p><h2>To add an intervention:</h2><h3>Add your own:</h3><p>On Care Plan page, select the menu <ion-icon name='menu'></ion-icon> to the right of the Topic to which you want to add.</p>      <p>Tap <ion-icon name='construct'></ion-icon>Add an Intervention</p>  <p>On the Add an Intervention page, enter the intervention description.</p><p>Select one or more disciplines, or enter others as needed.</p><p>Tap <span class='hilite'>SAVE</span>.</p><h3>Add from the Red Book:</h3><p>Make sure you’re on line and logged in. Verify the<ion-icon name='lock'></ion-icon> in the page heading.</p><p>On Care Plan page, select the menu <ion-icon name='menu'></ion-icon> to the right of the Topic to which you want to add.</p>      <p>Tap <ion-icon name='construct'></ion-icon>Add an Intervention</p>  <p>On the Add an Intervention page,</p><p>Tap <span class='hilite'>ADD FROM THE RED BOOK</span> button.</p><p>Optionally, search for an intervention.</p><p>Tap your selected intervention in the list.</p><p>You will return to the Add an Intervention page.</p><p>Change the text of the intervention as you wish, filling in blanks as needed.</p><p>A discipline may have been suggested. Verify and select disciplines or enter others as needed.</p><p>Tap <span class='hilite'>SAVE</span>.</p><h2>To copy a plan:</h2><p>On My Care Plans page, choose <span class='hilite'>CREATE A NEW PLAN</span>. Name the new plan and choose <spanclass='hilite'>Copy One of My Plans</span>.</p><p>The button will be disabled until you type a name for the new plan. Your new name cannot be one you'veused before.</p><p>Choose one of your plans from the <span class='hilite'>Select</span> page.</p><p>On the preview page, choose <span class='hilite'>Select All</span> or individually select outcomes or interventions you want included.</p><p>Scroll down and tap <span class='hilite'>SAVE</span> at the bottom of the screen.</p><h2>To delete a plan:</h2><p>On My Care Plans page, tap the name of the care plan to be deleted.</p><p>On Care Plan page, open the left side menu <ion-icon name='menu'></ion-icon>.</p><p>Select <ion-icon name='trash'></ion-icon> Delete this Plan</p><p>Confirm when prompted.</p><h2>To share a plan, or send it for use outside the application:</h2><p>On Care Plans page, tap the name of the care plan to be shared.</p><p>On Care Plan page, open the left side menu <ion-icon name='menu'></ion-icon>.</p><p>Choose <ion-icon name='share'></ion-icon> Share this Plan</p><p>On the textual Care Plan page, share by selecting the<span class='hilite'><ion-icon name='send'></ion-icon></span> icon for email, the<span class='hilite'><ion-icon name='clipboard'></ion-icon></span> icon to copy the plan to the clipboard for pasting elsewhere,or the <span class='hilite'><ion-icon name='paper'></ion-icon>PDF</span> icon.</p><p>If you choose<span class='hilite'><ion-icon name='paper'></ion-icon>PDF</span>, your device should have a share option within your PDF viewer application.</p>"

}