import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

interface Photo {
  url: string;
}

@Component({
  selector: 'app-find-matches',
  templateUrl: './find-matches.component.html',
  styleUrls: ['./find-matches.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate('300ms', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ transform: 'scale(0.5)', opacity: 0 }))
      ])
    ])
  ]
})
export class FindMatchesComponent implements OnInit {
  photos: Photo[] = [
    { url: 'assets/images/bugs.jpeg' },
    { url: 'assets/images/tasmanian.png' },
    { url: 'assets/images/sylvester.jpeg' },
    // ... more photos
  ];
  displayedPhotos: Photo[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadDisplayedPhotos();
  }

  loadDisplayedPhotos() {
    if (this.photos.length > 0) {
      this.displayedPhotos.unshift(this.photos.shift() as Photo);
    }
  }
  

  swipeLeft(photo: Photo) {
    console.log('Swiped left on photo:', photo);
    // Handle left swipe action here
    this.displayedPhotos.shift();
    if (this.photos.length > 0) {
      this.loadDisplayedPhotos();
    }
  }

  swipeRight(photo: Photo) {
    console.log('Swiped right on photo:', photo);
    // Handle right swipe action here
    this.displayedPhotos.shift();
    if (this.photos.length > 0) {
      this.loadDisplayedPhotos();
    }
  }
}
