# How to

Push new lwc

```
sfdx force:source:deploy -p path/to/component.js-meta.xml
```

example:

```
sfdx force:source:deploy -p force-app/main/default/lwc/dominic3/dominic3.js-meta.xml
```

Push new Apex

```
sfdx force:source:deploy -p path/to/MyApex.cls-meta.xml
```

example:

```
sfdx force:source:deploy -p force-app/main/default/classes/TestAccount.cls-meta.xml
```

New LWC:

```
sfdx force:lightning:component:create --type lwc -n myLightningWebComponent

```

Start Locale Dev:

```
sfdx force:lightning:lwc:start

```

# Some Docs

- https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_local_dev_setup
- https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_guidelines
- https://developer.salesforce.com/docs/component-library/overview/components
