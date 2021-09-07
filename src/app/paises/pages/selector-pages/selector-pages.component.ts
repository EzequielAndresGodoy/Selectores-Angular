import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styleUrls: ['./selector-pages.component.css']
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['',[Validators.required],],
    pais: ['',[Validators.required],],
    frontera: ['',[Validators.required],],
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = []
  cargando: boolean = false

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones

//Cuando cambie la region
//ESTA ES UNA OPCION
    //   this.miFormulario.get('region')?.valueChanges.subscribe( region => {
    //     this.paisesService.getPaisesPorRegion(region).subscribe(paises => {
    //       this.paises = paises;
    //     })
    //   })
    // }

    //Cuando cambie la region
//ESTA ES LA OPCION USANDO OPERADORES DE RXJS
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      }
      )

      //Cuando cambie el pais
//ESTA ES LA OPCION USANDO OPERADORES DE RXJS
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true
        }),
        switchMap ( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
        switchMap ( pais => this.paisesService.getPaisesPorCodigos( pais?.borders! ) )
      )
      .subscribe( paises => {
        //this.fronteras = pais?.borders || [];
        this.fronteras = paises
        this.cargando = false
      }
    )
  }

  guardar() {
    console.log(this.miFormulario)
  }

}
