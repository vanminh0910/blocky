//
//  BAddComponentViewController.swift
//  Blocky
//
//  Created by Viet Anh on 7/13/17.
//  Copyright © 2017 Viet Anh. All rights reserved.
//

import UIKit

@objc protocol BAddComponentViewControllerDelegate {
    @objc func didAddComponent(component: UIView)
}
class BAddComponentViewController: UIViewController {

    @IBOutlet weak var tableView: UITableView!
    var type : Int = 0
    weak var delegate:BAddComponentViewControllerDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.tableFooterView = UIView()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    @IBAction func applyAction(_ sender: Any) {
        
        _ = self.navigationController?.popViewController(animated: true)
        
        let titleLabel = self.tableView.cellForRow(at: IndexPath(row: 0, section: 0))?.viewWithTag(101) as! UITextField
        switch self.type {
        case 0:
            let button = UIButton(frame: CGRect(x: 0, y: 0, width: 100, height: 50))
            button.setTitle(titleLabel.text ?? "Button", for: .normal)
            button.backgroundColor = UIColor.random()
            button.layer.borderWidth = 1
            button.layer.borderColor = UIColor.random().cgColor
            self.delegate?.didAddComponent(component: button)
        case 1:
            let label = UILabel(frame: CGRect(x: 0, y: 0, width: 100, height: 50))
            label.isUserInteractionEnabled = true
            label.text = titleLabel.text
            label.textAlignment = .center
            label.layer.borderWidth = 1
            label.layer.borderColor = UIColor.random().cgColor
            label.backgroundColor = UIColor.random()
            self.delegate?.didAddComponent(component: label)
        case 2:
            let slider = UISlider(frame: CGRect(x: 0, y: 0, width: 100, height: 50))
            slider.tintColor = UIColor.random()
            self.delegate?.didAddComponent(component: slider)
            
        default:
            break;
        }
        
    }

}

extension BAddComponentViewController: UITableViewDelegate,UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        switch indexPath.row {
        case 0:
            return 44;
        case 1:
            return 100;
        case 2:
            return 44;
            
        default:
           return 44;
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 3
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        var cell: UITableViewCell? = nil
        
        switch indexPath.row {
        case 0:
            cell = tableView.dequeueReusableCell(withIdentifier: "addComponentTitleCell")
            return cell!
        case 1:
            cell = tableView.dequeueReusableCell(withIdentifier: "addComponentTypeCell")
            let picker = cell?.viewWithTag(102) as! UIPickerView
            picker.dataSource = self
            picker.delegate = self
            return cell!
        case 2:
            cell = tableView.dequeueReusableCell(withIdentifier: "addComponentScriptCell")
            return cell!
            
        default:
            break;
        }
        
        return UITableViewCell()
    }
}

extension BAddComponentViewController:UIPickerViewDelegate,UIPickerViewDataSource {
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        self.type = row
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return 3
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        switch row {
        case 0:
            return "Button"
        case 1:
            return "Label"
        case 2:
            return "Silder"
            
        default:
            break;
        }
        return ""
    }
    
    
}

extension CGFloat {
    static func random() -> CGFloat {
        return CGFloat(arc4random()) / CGFloat(UInt32.max)
    }
}

extension UIColor {
    static func random() -> UIColor {
        return UIColor(red:   .random(),
                       green: .random(),
                       blue:  .random(),
                       alpha: 1.0)
    }
}
