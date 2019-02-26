import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredtitle = '';
  enteredcontent = '';
  @Output() postcreated = new EventEmitter<Post>();
  postservice: PostsService;

  constructor(postservice: PostsService) {
    this.postservice = postservice;
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    /*const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postcreated.emit(post);*/
    this.postservice.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
