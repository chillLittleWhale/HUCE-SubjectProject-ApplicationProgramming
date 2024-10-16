import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, User } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './follow.component.html',
  styleUrl: './follow.component.css'
})
export class FollowComponent {
  followingList: Array<User> = [];
  followerList: Array<User> = [];
  userIdNumber: number = -1;
  mySelf: User | undefined;

  searchedUser!: User | null;
  searchForm = this.fb.group({
    email: ['']
  });

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userIdNumber = Number(this.route.snapshot.paramMap.get('userId'));
    console.log("userID: " + this.userIdNumber);

    this.dataService.getFollowedList(this.userIdNumber)
      .subscribe((data: Array<User>) => this.followerList = data)

    this.restartTable()

  }

  onFollow(id: number) {
    let updateMySelf = this.mySelf;
    if (updateMySelf) {
      updateMySelf.folowingList.push(id);         // thêm người kia vào folowingList của mình
      this.dataService.updateUser(this.userIdNumber, updateMySelf)
        .subscribe(response => {
          this.restartTable()
          console.log(`Thành công thêm id ${id} vào folowingList của bạn.`);
          // this.snackBar.open('Followed successfully', 'Close', { duration: 2000 });

          let updateUser!: User;
          this.dataService.getUserById(id).subscribe(response => {
            updateUser = response;
            if (updateUser) {
              updateUser.folowedList.push(this.userIdNumber);    // thêm mình vào folowerList của người kia
              this.dataService.updateUser(id, updateUser)
                .subscribe(response => {
                  this.restartTable()
                  console.log(`Thành công thêm id của bạn vào folowedList của người kia.`);
                  this.snackBar.open('Followed successfully', 'Close', { duration: 2000 });
                });
            }
          });
        });
    }
  }

  onUnFollow(id: number) {
    // console.log(`Chossen id: ${id}`);
    let updateMySelf = this.mySelf;
    if (updateMySelf) {
      updateMySelf.folowingList = updateMySelf.folowingList.filter(itemId => itemId !== id);  //xóa id của họ trong folowingList của mình
      // updateUser.folowingList.forEach(element => {
      //   console.log(element);
      // });
      this.dataService.updateUser(this.userIdNumber, updateMySelf)
        .subscribe(response => {
          this.restartTable();
          console.log(`Thành công xóa id ${id} khỏi folowingList của mình.`);
          // this.snackBar.open('Unfollowed successfully', 'Close', { duration: 2000 });

          let updateUser!: User;
          this.dataService.getUserById(id).subscribe(response => {
            updateUser = response;
            if (updateUser) {
              updateUser.folowedList = updateUser.folowedList.filter(itemId => itemId !== this.userIdNumber);  //xóa id mình trong folowedList của người kia
              this.dataService.updateUser(id, updateUser)
                .subscribe(response => {
                  this.restartTable();
                  console.log(`Thành công xóa id ${id} trong folowedList của người kia.`);
                  this.snackBar.open('Unfollowed successfully', 'Close', { duration: 2000 });
                });
            }
          }
          );
        });
    }
  }

  onSearch() {
    const email = this.searchForm.get('email')?.value;
    if (email) {
      this.dataService.findUserByEmail(email).subscribe(response => {
        if (response.status === 200) {
          this.searchedUser = response.body;
        } else if (response.status === 204) {
          this.searchedUser = null;
        }
      }, error => {
        console.error('Error searching user:', error);
        this.snackBar.open('Error searching user: ' + error, 'Close', { duration: 3000 });
        this.searchedUser = null;
      });
    }
  }

  restartTable() {
    this.dataService.getFollowingList(this.userIdNumber)
      .subscribe((data: Array<User>) => this.followingList = data)

    this.dataService.getUserById(this.userIdNumber)
      .subscribe((data: User) => this.mySelf = data)
  }

  isUserInBothLists(user: User): boolean {
    return this.followingList.some(u => u.id === user.id) && this.followerList.some(u => u.id === user.id);
  }

  isUserInFollingList(user: User): boolean {
    return this.followingList.some(u => u.id === user.id);
  }

  isUserInFollowerList(user: User): boolean {
    return this.followerList.some(u => u.id === user.id);
  }
}
