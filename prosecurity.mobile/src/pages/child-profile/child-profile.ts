import {Child} from "../../model/Child";
import {ChildService} from "../../providers/services/child.service";
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController} from "ionic-angular";
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GenderType, genderTypes} from "../../model/gender/gender-type";
import {ImagePickerComponent} from "../../components/image-picker/image-picker";
import {ToastNotificationService} from "../../providers/services/toast-notification.service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-child-profile',
  templateUrl: 'child-profile.html',
})
export class ChildProfile implements OnInit {

  public child = Child;
  public action: string;
  childForm: FormGroup;
  public genderTypes: GenderType[] = genderTypes;
  public isCheck: boolean = false;

  @ViewChild(ImagePickerComponent) imagePicker: ImagePickerComponent;
  public chosenPictureId: string;

  mask: any[] = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  @ViewChild('stepper') stepper;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private childService: ChildService,
    private toastNotificationService: ToastNotificationService,
    public translate: TranslateService,
    private translatePipe: TranslatePipe,) {

    this.buildForm();
    this.child = this.navParams.get('child');
    this.action = this.navParams.get('action');
    if (!this.child) {
      this.child = Child;
    }
    console.error('Opened Modal with param', this.child);
    console.error('this.child[\'imgId\']:', this.child['imgId']);
    this.childForm.patchValue(this.child);
  }

  ngOnInit() {

  }

  selectChange(e) {
    console.log(e);
    if (e == 0) {
      // TODO: msultanova 5/17/19 remove me
      this.isCheck = false;
    } else if (e == 1) {
      this.isCheck = true;
      this.chosenPictureId = this.child['imgId']; //this.childForm.get("imgId").value;
      const loading = this.loadingCtrl.create();
      let card_id = this.childForm.controls['cardNumber'].value;
      this.childForm.controls['cardNumber'].patchValue(card_id.substring(0, 23));
      console.log("Send: ", this.childForm.controls['cardNumber'].value);
      loading.present();
      this.childService.getChildByCard(card_id.replace(/\D/g, '').substring(0, 19),
        this.childForm.controls['password'].value,
        this.childForm.controls['id'].value)
        .then(list => {
          loading.dismiss();
          console.error("Answer: ", list);
          console.error("this.childForm: ", this.childForm.controls);
          this.childForm.patchValue(list);
        }).catch(err => {
        loading.dismiss();
        if (err.status == 400) {
          let errors = err.error;

          errors.forEach((error) => {
            let field = this.childForm.controls[error.code];
            field.setErrors({[error.message]: true});
          });

          this.onValueChanged();
          this.stepper.selectedIndex = 0;
          return;
        }
      });
    }
  }

  updateProfile() {
    let loader = this.loadingCtrl.create({
      duration: 200
    });
    loader.present().then(() => this.navCtrl.pop()); // Get back to profile page. You should do that after you got data from API
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveChild() {
    const loading = this.loadingCtrl.create();
    loading.present();

    this.imagePicker.getValue().then(imgId => {

      let card_id = this.childForm.controls['cardNumber'].value;
      card_id = card_id.replace(/\D/g, '').substring(0, 19);
      // this.childForm.controls['cardNumber'].patchValue(card_id);

      this.childForm.patchValue({img: imgId, cardNumber: card_id});
      this.childService.save(this.childForm.getRawValue()).then(_resp => {
        loading.dismiss();
        if (this.action == 'edit') {
          this.dismiss();
          this.toastNotificationService.presentToast(this.translatePipe.transform('CHILD_PROFILE.edit_success'));

        } else {
          this.dismiss();
          this.toastNotificationService.presentToast(this.translatePipe.transform('CHILD_PROFILE.add_success'));
        }
      }).catch(err => {
        loading.dismiss();
        if (err.status == 400) {
          let errors = err.error;

          errors.forEach((error) => {
            let field = this.childForm.controls[error.code];
            field.setErrors({[error.message]: true});
          });

          this.onValueChanged();
          this.stepper.selectedIndex = 0;
          return;
        }
      });
    });
  }


  deleteChild() {
    //todo действительно ли вы хотите удалить?

    const deleteFor = this.alertCtrl.create({
      //todo change by languge
      title: ' ',
      message: this.translatePipe.transform('CHILD_PROFILE.delete_child'),
      buttons: [{
        text: this.translatePipe.transform('CHILD_PROFILE.delete_for_all'),
        handler: data => {
          this.delete('permanent');
        }
      }, {
        text: this.translatePipe.transform('CHILD_PROFILE.delete_for_me'),
        handler: data => {
          this.delete('temporary');
        }
      }]
    });
    deleteFor.present();

  }


  delete(how: string) {
    const loading = this.loadingCtrl.create();
    loading.present();
    let childId = this.childForm.controls['id'].value;
    if (childId) {
      this.childService.delete(childId, how).then(_resp => {
        this.dismiss();
        this.toastNotificationService.presentToast(this.translatePipe.transform('CHILD_PROFILE.delete_success_forever'));
      });
    } else {
      this.dismiss();
      this.toastNotificationService.presentToast(this.translatePipe.transform('CHILD_PROFILE.cant_delete'));
    }
  }

  static ionViewDidLoad() {
    console.log('ionViewDidLoad ChildProfile Modal -Page');
  }

  static handleFile(files: any) {
    console.log({files})
  }

  buildForm() {
    this.childForm = this.fb.group({
      'id': null,
      'img': null,
      'cardNumber': ['', [
        Validators.required,
        Validators.pattern('[\\d]{4}[- ]?[\\d]{2}[- ]?[\\d]{5}[- ]?[\\d]{4}[- ]?[\\d]{4}[\\w]?'),
      ]
      ],
      'name': ['', [
        Validators.required,
        Validators.pattern('^[А-Яа-яA-Za-z]*[ _-]*[А-Яа-яA-Za-z]+$'),//'^[\\w\u0430-\u044f]*[ -]*[\\w\u0430-\u044f]*$'
        Validators.minLength(2),
        Validators.maxLength(25)
      ]
      ],
      'surname': ['', [
        Validators.required,
        Validators.pattern('^[А-Яа-яA-Za-z]*[ _-]*[А-Яа-яA-Za-z]+$'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]
      ],
      'patronymic': ['', [
        Validators.pattern('^[А-Яа-яA-Za-z]*[ _-]*[А-Яа-яA-Za-z]+$'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]
      ],
      'birthDate': ['', [
        Validators.required
      ]
      ],
      'gender': ['', [
        Validators.required
      ]
      ],
      'notification': ['', []
      ],
      'password': ['', [
        Validators.required
      ]
      ]
    });
    this.childForm.valueChanges.subscribe(data => {
      this.onValueChanged(data);
      Object.keys(this.childForm.controls).forEach(value => {
        // console.log('AAAA', this.childForm.controls);
        console.log(value, ' - ', this.childForm.controls[value].value, this.childForm.controls[value].valid);
      })

    });

    this.onValueChanged();

  }

  onValueChanged(data?: any) {
    if (!this.childForm) {
      return;
    }
    const form = this.childForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
              break;
            }
          }
        }
      }
    }


  }

  formErrors = {
    'cardNumber': '',
    'name': '',
    'surname': '',
    'patronymic': '',
    'gender': '',
    'notification': '',
    'password': ''
  };

  validationMessages = {
    'cardNumber': {
      'required': this.translatePipe.transform('CHILD_PROFILE.cardNumber_req'),
      'pattern': this.translatePipe.transform('CHILD_PROFILE.cardNumber_pattern'),
      'unknown': this.translatePipe.transform('CHILD_PROFILE.cardNumber_unknown'),
      'unavailable': this.translatePipe.transform('CHILD_PROFILE.cardNumber_unavailable'),
      'alreadyInUse': this.translatePipe.transform('CHILD_PROFILE.cardNumber_alreadyInUse'),
    },
    'name': {
      'required': this.translatePipe.transform('CHILD_PROFILE.name_req'),
      'pattern': this.translatePipe.transform('CHILD_PROFILE.name_pattern'),
      'minlength': this.translatePipe.transform('CHILD_PROFILE.name_min'),
      'maxlength': this.translatePipe.transform('CHILD_PROFILE.name_max'),
    },
    'surname': {
      'required': this.translatePipe.transform('CHILD_PROFILE.surname_req'),
      'pattern': this.translatePipe.transform('CHILD_PROFILE.surname_pattern'),
      'minlength': this.translatePipe.transform('CHILD_PROFILE.surname_min'),
      'maxlength': this.translatePipe.transform('CHILD_PROFILE.surname_max'),
    },
    'patronymic': {
      'pattern': this.translatePipe.transform('CHILD_PROFILE.patronymic_pattern'),
      'minlength': this.translatePipe.transform('CHILD_PROFILE.patronymic_min'),
      'maxlength': this.translatePipe.transform('CHILD_PROFILE.patronymic_max'),
    },
    'gender': {
      'required': this.translatePipe.transform('CHILD_PROFILE.gender_req'),
    },
    'notification': {},
    'password': {
      'required': this.translatePipe.transform('CHILD_PROFILE.password_required'),
      'notCorrect': this.translatePipe.transform('CHILD_PROFILE.password_notCorrect')
    }
  };
}
