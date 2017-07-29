//
//  ViewController.swift
//  Blocky
//
//  Created by Viet Anh on 7/13/17.
//  Copyright © 2017 Viet Anh. All rights reserved.
//

import UIKit
import BFDragGestureRecognizer


class ViewController: UIViewController {
    
    var startCenter = CGPoint.zero
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "addComponentSegue" {
            (segue.destination as! BAddComponentViewController).delegate = self
        }
    }
}

extension ViewController: BAddComponentViewControllerDelegate {
    func didAddComponent(component: UIView) {
     let holdDragRecognizer = BFDragGestureRecognizer()
        holdDragRecognizer.addTarget(self, action: #selector(self.dragRecognized(_:)))
        component.addGestureRecognizer(holdDragRecognizer)
        component.center = self.view.center
        self.view.addSubview(component)
    }
    
    
    func dragRecognized(_ recognizer: BFDragGestureRecognizer) {
        let view: UIView? = recognizer.view
        if recognizer.state == .began {
            self.startCenter = (view?.center)!
            view?.superview?.bringSubview(toFront: view!)
            UIView.animate(withDuration: 0.2, animations: {() -> Void in
                view?.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
                view?.alpha = 0.7
            })
        }
        else if recognizer.state == .changed {
            let translation: CGPoint = recognizer.translation(in: self.view)
            let center = CGPoint(x: (startCenter.x) + translation.x, y: (startCenter.y) + translation.y)
            view?.center = center
        }
        else if recognizer.state == .ended || recognizer.state == .cancelled {
            UIView.animate(withDuration: 0.2, animations: {() -> Void in
                view?.transform = CGAffineTransform.identity
                view?.alpha = 1.0
            })
        }
        else if recognizer.state == .failed {
            
        }
    }
}

