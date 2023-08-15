import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  isLoggedIn = true;

  onSidenavToggle(): void {
    console.log("onSidenavToggle");
    this.sidenavToggle.emit();
  }

  logout(){
    
  }
}
