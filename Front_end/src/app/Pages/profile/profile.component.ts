import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, User, Sex } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudinaryModule } from '@cloudinary/ng';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule, CloudinaryModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userIdNumber: number = -1;
  mySelf!: User;    // khai báo ! tức là chắc chắn luôn có myself, không phải undifined
  selectedAvatarUrl: string = '../../../assets/pic/avatar-unknown-90.png';
  // img!: CloudinaryImage;

  informationForm = this.fb.group({
    name: [''],
    email: [''],
    password: [''],
    avatar: [''],
    sex: [''],
  });
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.userIdNumber = Number(this.route.snapshot.paramMap.get('userId'));
    console.log("userID: " + this.userIdNumber);

    this.dataService.getUserById(this.userIdNumber)
      .subscribe((data: User) => {
        this.mySelf = data;
        console.log('mySelf:', this.mySelf);
        this.informationForm.patchValue({
          name: this.mySelf.name,
          email: this.mySelf.email,
          password: this.mySelf.password,
          avatar: this.mySelf.avatar,
          sex: this.mySelf.sex.toString(),
        });
        this.selectedAvatarUrl = this.mySelf.avatar;
      })
  }


  file: File | null = null;
  uploadFile(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();

    if (!this.file) { return }
    reader.readAsDataURL(this.file)
    reader.onload = (e: any) => {
      this.selectedAvatarUrl = e.target.result;
    }
  }

  async onUpdateSubmit() {
    // Nếu có file ảnh mới, tải lên Cloudinary trước, lấy URL cho vào this.selectedAvatar
    if (this.file) {
      try {
        await this.uploadImage(this.file);
      } catch (error) {
        console.error('Error uploading image:', error);
        this.snackBar.open('Error uploading image: ' + error, 'Close', {
          duration: 3000
        });
        return;
      }
    }

    const sexValue = this.informationForm.get('sex')?.value as keyof typeof Sex;
    const sexEnumValue = Sex[sexValue];

    const updatedUser: User = {
      ...this.mySelf,
      name: this.informationForm.get('name')?.value || this.mySelf.name,
      email: this.informationForm.get('email')?.value || this.mySelf.email,
      password: this.informationForm.get('password')?.value || this.mySelf.password,
      sex: sexEnumValue !== undefined ? sexEnumValue : Sex.UNKNOW,
      avatar: this.selectedAvatarUrl
    };

    this.dataService.updateUser(this.mySelf.id, updatedUser).subscribe(response => {
      console.log('User updated successfully', response);
      this.mySelf = updatedUser; // Update mySelf with the new values
      this.snackBar.open('Updated user information successfully! ', 'Close', {
        duration: 2000
      });
    }, error => {
      console.error('Error updating user', error);
      this.snackBar.open('Error updating user: ' + error.message, 'Close', {
        duration: 3000
      });
    });
  }

  // Method to upload image to Cloudinary and return a Promise
  uploadImage(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'swb6l34d'); // Replace with your Cloudinary upload preset

    return new Promise((resolve, reject) => {
      this.http.post('https://api.cloudinary.com/v1_1/dx5ttmfml/image/upload', formData)  // my cloud name is 'dx5ttmfml', replace with your cloud name
        .subscribe((response: any) => {
          console.log('Image uploaded successfully:', response);
          this.selectedAvatarUrl = response.secure_url; // Set the uploaded image URL to avatarPath
          console.log(this.selectedAvatarUrl);
          resolve();
        }, error => {
          console.error('Image upload failed:', error);
          reject(error);
        });
    });
  }
}
