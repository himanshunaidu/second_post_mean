import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsupdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      // pipe is used to map the returned object to another object type
      .pipe(map((postdata) => {
        return postdata.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            _id: post._id
          };
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsupdated.next([...this.posts]);
      });
    // return [...this.posts];
    // ... <- Used for extracting a deep copy of the array
  }

  getPostUpdateListener() {
    return this.postsupdated.asObservable();
  }

  addPost(title1: string, content1: string) {
    const post: Post = {_id: null, title: title1, content: content1};
    this.http.post<{message: string, postid: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responsedata) => {
        // console.log(responsedata.message);
        const id = responsedata.postid;
        post._id = id;
        this.posts.push(post);
        this.postsupdated.next([...this.posts]);
      });
  }

  deletePost(postid: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postid)
      .subscribe(() => {
        // console.log('Deleted');
        const postsremaining = this.posts.filter(post => post._id !== postid);
        this.posts = postsremaining;
        this.postsupdated.next([...this.posts]);
      });
  }
}
